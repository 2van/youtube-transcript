let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('https support is disabled!');
}

const fs = require('fs');

const options = {
  method: 'POST',
  hostname: 'www.youtube.com',
  path: '/youtubei/v1/get_transcript',
  headers: {
    'Content-Type': 'application/json',
  },
  maxRedirects: 20,
};

// const input = 'https://www.youtube.com/watch?v=id';

function getPostData(params) {
  return {
    context: {
      client: {
        hl: 'en',
        gl: 'US',
        remoteHost: '42.200.195.147',
        deviceMake: 'Apple',
        deviceModel: '',
        visitorData: 'Cgt4dk5DWDJOSzJpcyiptc2tBjIKCgJDThIEGgAgSw%3D%3D',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0,gzip(gfe)',
        clientName: 'WEB',
        clientVersion: '2.20240123.06.00',
        osName: 'Macintosh',
        osVersion: '10.15',
        originalUrl:
          'https://www.youtube.com/watch?v=w35S4WoxmzY&ab_channel=Lumbago&themeRefresh=1',
        screenPixelDensity: 2,
        platform: 'DESKTOP',
        clientFormFactor: 'UNKNOWN_FORM_FACTOR',
        configInfo: {
          appInstallData:
            'CKm1za0GEOSz_hIQt66wBRDM364FEL2KsAUQ56-wBRDnuq8FEMyu_hIQz6iwBRCa8K8FEKWQsAUQvbauBRDd6P4SEPuSsAUQ3ov_EhDcgrAFEK7U_hIQ0-GvBRDUoa8FEKy3rwUQmPz-EhCmmrAFEKaBsAUQk_yvBRDyrbAFEKn3rwUQnqCwBRC8-a8FEKylsAUQ9fmvBRDViLAFELersAUQ86GwBRCZsLAFELiqsAUQqJqwBRD6p7AFEMn3rwUQ7aKwBRDX6a8FEIjjrwUQn66wBRChrrAFEInorgUQnouwBRClwv4SEM2VsAUQ9KuwBRC_o7AFEOHyrwUQt--vBRD2q7AFEOLUrgUQ6-j-EhC--a8FEKmN_xIQgq-wBRDqw68FEL2ZsAUQ7qKvBRDQjbAFEIiHsAUQt-r-EhD8hbAFEOuTrgUQ2cmvBRDbr68FELiLrgUQl4OwBRCigbAFEP6nsAUQta6wBRDCr7AFEM6L_xIQvJqwBRCkjP8S',
        },
        screenDensityFloat: 2,
        userInterfaceTheme: 'USER_INTERFACE_THEME_DARK',
        timeZone: 'Asia/Shanghai',
        browserName: 'Firefox',
        browserVersion: '121.0',
        acceptHeader:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        deviceExperimentId:
          'ChxOek15T0RNd01EY3dNVEEyT0RjNU1qY3hPQT09EKm1za0GGKm1za0G',
        screenWidthPoints: 1800,
        screenHeightPoints: 686,
        utcOffsetMinutes: 480,
        mainAppWebInfo: {
          graftUrl: 'https://www.youtube.com/watch?v=w35S4WoxmzY',
          pwaInstallabilityStatus: 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
          webDisplayMode: 'WEB_DISPLAY_MODE_BROWSER',
          isWebNativeShareAvailable: false,
        },
      },
      user: { lockedSafetyMode: false },
      request: {
        useSsl: true,
        internalExperimentFlags: [],
        consistencyTokenJars: [],
      },
      clickTracking: {
        clickTrackingParams: 'CBEQ040EGAUiEwimhJvRv_qDAxWpRPUFHYs7CRY=',
      },
      adSignalsInfo: {
        params: [
          { key: 'dt', value: '1706252970428' },
          { key: 'flash', value: '0' },
          { key: 'frm', value: '0' },
          { key: 'u_tz', value: '480' },
          { key: 'u_his', value: '3' },
          { key: 'u_h', value: '1169' },
          { key: 'u_w', value: '1800' },
          { key: 'u_ah', value: '1125' },
          { key: 'u_aw', value: '1800' },
          { key: 'u_cd', value: '30' },
          { key: 'bc', value: '31' },
          { key: 'bih', value: '686' },
          { key: 'biw', value: '1785' },
          { key: 'brdim', value: '0,44,0,44,1800,44,1800,1125,1800,686' },
          { key: 'vis', value: '1' },
          { key: 'wgl', value: 'true' },
          { key: 'ca_type', value: 'image' },
        ],
      },
    },
    params,
  };
}

const enableBeak = true;
function logScript(string) {
  const json = JSON.parse(string);
  const list = getNested(
    json.actions[0],
    'updateEngagementPanelAction.content.transcriptRenderer.content.transcriptSearchPanelRenderer.body.transcriptSegmentListRenderer.initialSegments'.split(
      '.'
    )
  );
  const id = list
    .find((v) => v.transcriptSegmentRenderer)
    ?.transcriptSegmentRenderer.targetId?.split('.')[0];
  const text = list
    .map((v) =>
      v.transcriptSegmentRenderer?.snippet?.runs
        ?.map((r) => r.text)
        .filter((v) => v !== undefined)
        .join(' ')
    )
    .filter((v) => v !== undefined)
    .join(enableBeak ? '\n' : ' ');
  //   console.log(text);
  fs.writeFileSync(id + '.txt', text);
  return id;
}

function getNested(obj, args) {
  return args.reduce((obj, level) => obj && obj[level], obj);
}

function fetchYTPageBody(id) {
  const url = `https://www.youtube.com/watch?v=${id}`;
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        let str = '';
        res.on('data', (d) => {
          str += d;
        });
        res.on('end', () => {
          const targetStr =
            str.split('"getTranscriptEndpoint":')[1]?.split('}')[0] + '}';
          const targetJson = JSON.parse(targetStr);
          // console.log(targetJson.params);
          resolve(targetJson.params);
        });
      })
      .on('error', (e) => {
        console.error(e);
      });
  });
}

async function main() {
  const arg = process.argv.slice(2)[0];
  const isLink = arg.includes('https://www.youtube.com/watch?v');
  const videoId = isLink ? new URL(arg).searchParams.get('v') : arg;
  const params = await fetchYTPageBody(videoId);
  try {
    const data = fs.readFileSync(videoId + '.txt', { encoding: 'utf-8' });
    console.log('cache exists:', data.slice(0, 100));
    return;
  } catch (error) {}
  const postData = getPostData(params);
  const req = https.request(options, function (res) {
    const chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function (chunk) {
      const body = Buffer.concat(chunks);
      const res = body.toString();
      // console.log(res)
      logScript(res);
    });

    res.on('error', function (error) {
      console.error(error);
    });
  });

  req.write(JSON.stringify(postData));
  req.end();
}

main();
