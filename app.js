/////getparams/////////////////////////////////////////////////////////////////////////////
var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};
var params = getParams(window.location.href);
//////////////////////////////////////////////////////////////////////////////

var $$ = Dom7;

var grecaptcharesponsedata = '';
var isLocal = false;
var DEBUG = true;
var visits = 1;

if ((window.location.href.indexOf("localhost") > -1)||(window.location.href.indexOf("127.0.0.1") > -1)) 
{
  DEBUG = true;
  console.log('local development');
  isLocal = true;
  var access_token = params.access_token;
  var apidataurl = "https://script.google.com/macros/s/AKfycby_AtgqDzTqqqcWQCtmit6Tce26EopdKKfHnmO6YRg/dev?access_token="+access_token;
  var devmodeurl = "https://script.google.com/macros/s/AKfycbwnkEpeAp4LLXvtco24TE2erQbb-xoFibKQXVmCaqbJZPYDnV8k05RM2Xyfm_H0VtkqpQ/exec";
}
else
{
  var apidataurl = "https://script.google.com/macros/s/AKfycbwwfV_bou7tIIru5NGrr0sP9-ZcYQ4jzKqWBAAyINizfNV_bHGalRs9_qjD52Ddk3E-/exec";
  DEBUG = false;
}


//////////console.log/////////////////////////////////////////////////////////////////////////////////////////////

if(!DEBUG){
    if(!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
}
//////////console.log/////////////////////////////////////////////////////////////////////////////////////////////


if (params.meditera !== undefined )
{
  let meditera = params.meditera;
  meditera = meditera.replace('web+meditera://','');
  meditera = meditera.replace('javascript:','');
  meditera = safe(meditera);
  if ((meditera.startsWith("http://localhost:8080"))||(meditera.startsWith("https://meditera.netlify.app")))
  {
    window.location.href = meditera;
  }
}

var app = new Framework7({
el: '#app',
theme: 'aurora',
name: 'Meditera',
id: 'meditera.netlify.app',
view: {
  browserHistory: true,
  browserHistorySeparator: '#page',
  browserHistoryStoreHistory: false,
},
on: {
  init() {
    fappready();
  },
},
routes: [
  {
    path: '/',
    url: '/',
    on: {
      pageAfterIn: function test (e, page) {
        if (window.deferredPrompt) fmediteranstallclick();
        if (window.mediterainstalled) fmediterabukaapp();
        frefresh();
        fmediteravisits();
        console.log('beranda');
        fmediterafitur();
      },
    },
  },
  {
    path: '/admin/',
    url: 'admin.html',
    on: {
      pageAfterIn: function test (e, page) {
        fpageadmin();
      },
    },
    beforeEnter: function ({ resolve, reject }) {
      function fperiksakesiapan({ resolve, reject })
      {resolve();return;
          if (typeof dashboarddata === 'undefined' || dashboarddata === null) {
            // variable is undefined or null
            setTimeout(function(){ fperiksakesiapan({ resolve, reject }); }, 1000);
            return;
          }
            let data = JSON.parse(dashboarddata.user.usermydata)
            if (data.admin)
            {
                resolve();
            }
            else
            {
                app.dialog.alert('Tidak punya izin', 'Status')
                reject();
            }
      }
      fperiksakesiapan({ resolve, reject })
    },
  },
  {
    path: '(.*)',
    url: '404.html',
  },
],
});


//////////on app ready////////////////////////////////////////////////////
function fappready()
{
  console.log('app ready');
  if (!isLocal) fcountvisits();
  
}

//////////on dom ready////////////////////////////////////////////////////
window.addEventListener('DOMContentLoaded', () => {
  console.log('dom ready');
  
  
});

function fcountvisits()
{
  //app.request.json('https://api.countapi.xyz/hit/meditera.bsmijatim.org/visits').then((res) => {console.log(res.data);visits = res.data.value;});
  fetch('https://api.countapi.xyz/hit/meditera.netlify.app/visits', {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
      },
  })
  .then(response => response.json())
  .then(async(response) => {
      visits = response.value;
  })
}

function fmediteravisits()
{
  $$('.meditera-visits').on('click', function () {
      app.dialog.alert(visits,'Kunjungan');
  });
}

function fpagereload()
{
    //location.reload();
    window.location.reload();
    //history.go(0);
}

function frefresh()
{
  $$('.meditera-refresh').on('click', function () {
      fpagereload();
  });
}


/////////install//////////////////////////////////////////////////
//https://web.dev/codelab-make-installable/
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile.
  event.preventDefault();
  console.log('??', 'beforeinstallprompt', event);
  // Stash the event so it can be triggered later.
  window.deferredPrompt = event;
  // Remove the 'hidden' class from the install button container.
  //$$('.meditera-install').removeClass('display-none');
  fmediteranstallclick();
});

function fmediteranstallclick()
{
  $$('.meditera-install').removeClass('display-none');
  $$('.meditera-install').on('click', async function () {
    console.log('??', 'butInstall-clicked');
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      // The deferred prompt isn't available.
      return;
    }
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    const result = await promptEvent.userChoice;
    console.log('??', 'userChoice', result);
    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
    window.deferredPrompt = null;
    // Act on the user's choice
    if (result === 'accepted') {
      console.log('User accepted the install prompt.');
    } else if (result === 'dismissed') {
      console.log('User dismissed the install prompt');
    }
    // Hide the install button.
    $$('.meditera-install').addClass('display-none');
  });
  $$('.meditera-bukaapp').addClass('display-none');
  if (localStorage.getItem("mediterainstalled") !== null)
  {
    localStorage.removeItem("mediterainstalled");
  }
}

function fmediterabukaapp()
{
  const os = detectOS();
  const browserName = getBrowserName();
  const display = getPWADisplayMode();
  if (display === 'browser')
  {
      console.log('display :'+display);
      if (os === 'Android')
      {
        console.log('os :'+os);
        if (browserName === 'Chrome')
        {
          $$('.meditera-bukaapp').removeClass('display-none');
          $$('.meditera-bukaapp').on('click', function () {
            window.open(window.location.href, "_blank");
          });
        }
        else if (browserName === 'Samsung')
        {
          $$('#overlay-welcome .meditera-bukaapp').text('meditera App Tersedia');
          $$('#overlay-welcome .meditera-bukaapp').removeClass('display-none');
          $$('#overlay-welcome .meditera-bukaapp').on('click', function () {
            //window.open(window.location.href, "_blank");
          });
        }
      }
      else if (os === 'Windows')
      {
        console.log('os :'+os);
        if (browserName === 'Edge')
        {
          console.log('browserName :'+browserName);
          $$('.meditera-bukaapp').removeClass('display-none');
          $$('.meditera-bukaapp').on('click', function () {
          let url = 'web+meditera://'+window.location.href;
            window.open(url, "_blank");
          });      
        }
        else if (browserName === 'Chrome')
        {
          $$('.meditera-bukaapp').removeClass('display-none');
          $$('.meditera-bukaapp').on('click', function () {
          let url = 'web+meditera://'+window.location.href;
            window.open(url, "_blank");
          });
        }
      }
  }
}

window.addEventListener('appinstalled', (event) => {
  console.log('??', 'appinstalled', event);
  // Clear the deferredPrompt so it can be garbage collected
  window.deferredPrompt = null;
  $$('.meditera-install').addClass('display-none');
  window.mediterainstalled = true;
  localStorage.setItem("mediterainstalled",true)  
  const os = detectOS();
  if (os === 'Windows'){let timeout = setTimeout(fmediterabukaapp, 5000);}else{let timeout = setTimeout(fmediterabukaapp, 20000);}
});

function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if (navigator.standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}

//console.log(getPWADisplayMode());

window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
  let displayMode = 'browser';
  if (evt.matches) {
    displayMode = 'standalone';
  }
  // Log display mode change to analytics
  console.log('DISPLAY_MODE_CHANGED', displayMode);
});

async function tesinstall()
{
  if ('getInstalledRelatedApps' in navigator) {
      const relatedApps = await navigator.getInstalledRelatedApps();
      //console.log('instaled: '+relatedApps.length > 0);
      if (relatedApps.length > 0) {
        //window.open(window.location.href, "_blank");
        console.log('app installed');
        if (getPWADisplayMode() === 'browser')
        {
          //window.open(window.location.href, "_blank");
          //const anchor = document.createElement("a");
          //anchor.setAttribute('href', window.location.href);
          //anchor.setAttribute('target', '_blank');
          //anchor.click();
          //openapp();
          //window.location.href = 'https://meditera.bsmijatim.org';
          window.mediterainstalled = true;
          fmediterabukaapp();
          
        }
      }else{
        console.log('app not installed');
        const os = detectOS();
        const browserName = getBrowserName();
        if ((os === 'Windows')&&((browserName === 'Edge')||(browserName === 'Chrome')))
        {
          if (localStorage.getItem("mediterainstalled") !== null)
          {
            let isInstalled = localStorage.getItem("mediterainstalled");
            if (isInstalled)
            {
              window.mediterainstalled = true;
              fmediterabukaapp();
            }
          }
        }
      }
      relatedApps.forEach((app) => {
        console.log(app.id, app.platform, app.url);
      });
  } else {
    console.log('getInstalledRelatedApps not supported');
  }
}

if (!isSecureContext) {  
  location.protocol = 'https:';
}

function isWindowsAppInstalled()
{
  const os = detectOS();
  const browserName = getBrowserName();
  let isInstalled = localStorage.getItem("mediterainstalled");
  let isWindowsAppInstall = false;
  if ((os === 'Windows')&&(isInstalled)&&((browserName === 'Edge')||(browserName === 'Chrome')))
  {
      isWindowsAppInstall = true;
  }
  return isWindowsAppInstall;
}



function finstallload()
{
    const os = detectOS();
    if (os === 'Windows')
    {
      console.log('registerProtocolHandler');
      navigator.registerProtocolHandler('web+meditera', '/?meditera=%s');
    }
    
  // replace standalone with your display used in manifest
  window.matchMedia('(display-mode: standalone)')
      .addListener(event => {
          if (event.matches) {
             // From browser to standalone
             console.log('From browser to standalone');
          } else {
             // From standalone to browser
             console.log('From standalone to browser');
          }
      });
  tesinstall();
  console.log('isStandalone = '+isStandalone());
}

(async() => {
  finstallload();
})();


function isStandalone() {
  // For iOS
  if(window.navigator.standalone) return true

  // For Android
  if(window.matchMedia('(display-mode: standalone)').matches) return true

  // If neither is true, it's not installed
  return false
}


function openapp()
{
  var dialog = app.dialog.create({
    content:''////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      +'<div style="width:100%;">'
      +'  <div style="display:flex;flex-direction:column;align-items:center;justify-content: center;">'
      +'      <img id="img" src="" style="width:150px;height:150px;margin: 10px 10px;object-fit: cover;">'
      +'      <p style="font-weight:normal;">meditera App Tersedia</p>'
      +'      <div class="data-table"></div>'
      +'  </div>'
      +'</div>',//////////////////////////////////////////////////////////////////////////////////////////////////
    closeByBackdropClick: false,
    destroyOnClose: true,
    verticalButtons: false,
    on: {
      opened: function () {
        //console.log('Dialog opened')
        let src = "icon512.png";
        $$('#img').attr('src',src);
      }
    },
    buttons: [
      {
        text: 'Nanti Saja',
        close:true,
        color: 'gray',
        onClick: function(dialog, e)
          {

          }
      },
      {
        text: 'Buka App',
        close:true,
        color: 'red',
        onClick: function(dialog, e)
          {
            window.open(window.location.href, "_blank");
          }
      },
    ]
  });
  dialog.open();
}

const isInStandaloneMode = () =>
      (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');

 if (isInStandaloneMode()) {
    console.log("webapp is installed")
}

function detectOS() {
    const platform = navigator.platform.toLowerCase(),
        iosPlatforms = ['iphone', 'ipad', 'ipod', 'ipod touch'];

    if (platform.includes('mac')) return 'MacOS';
    if (iosPlatforms.includes(platform)) return 'iOS';
    if (platform.includes('win')) return 'Windows';
    if (/android/.test(navigator.userAgent.toLowerCase())) return 'Android';
    if (/linux/.test(platform)) return 'Linux';

    return 'unknown';
}

const getBrowserName = () => {
  let browserInfo = navigator.userAgent;
  let browser;
  if (browserInfo.includes('Opera') || browserInfo.includes('Opr')) {
    browser = 'Opera';
  } else if (browserInfo.includes('Edg')) {
    browser = 'Edge';
  } else if (browserInfo.includes('Samsung')) {
    browser = 'Samsung'
  } else if (browserInfo.includes('Chrome')) {
    browser = 'Chrome';
  } else if (browserInfo.includes('Safari')) {
    browser = 'Safari';
  } else if (browserInfo.includes('Firefox')) {
    browser = 'Firefox'
  } else {
    browser = 'unknown'
  }
    return browser;
}
/////////install//////////////////////////////////////////////////





app.on('pageInit', function (page) {
  //console.log('Page is now pageInit');
  let mypreloader = app.dialog.preloader();
  setTimeout(function () {mypreloader.close();}, 1000);
  //console.log(page.router.currentRoute);
  //console.log(app.views.current);
});

app.on('pageBeforeIn', function (page) {

});

app.on('pageAfterIn', function (page) {

 
});

//console.log(app.views.current);
//console.log(app.views.current.router.initialUrl);
var currentrouturl = app.views.current.router.initialUrl;
var currentmediteramenu = $$('a[href="'+currentrouturl+'"]');
currentmediteramenu.addClass('active-link');



////////////////////////////////////////////////////
$$('.meditera-menu').on('click', function (e) {
  $$('.meditera-menu').removeClass('active-link');
  $$(this).addClass('active-link');
});
/////////////////////////////////////////////////////



/////fdeviceid////////////////////////////////////////
// Text with lowercase/uppercase/punctuation symbols
async function fdevice()
{
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var txt = "meditera.bsmijatim,org <canvas> 1.0";
ctx.textBaseline = "top";
// The most common type
ctx.font = "14px 'Arial'";
ctx.textBaseline = "alphabetic";
ctx.fillStyle = "#f60";
ctx.fillRect(125,1,62,20);
// Some tricks for color mixing to increase the difference in rendering
ctx.fillStyle = "#069";
ctx.fillText(txt, 2, 15);
ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
ctx.fillText(txt, 4, 17);
let data = canvas.toDataURL("image/png;base64");
const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(data));
var hash = Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
return hash;
}

function fdeviceid()
{
const p = Promise.resolve(fdevice());
p.then(value => {
  window.mediteradeviceid = value;
}).catch(err => {
  return err;
});
}

fdeviceid();
/////fdeviceid////////////////////////////////////////


///logout button/////////////////////////
function flogout()
{
$$('.my-logout').on('click', function () {
  app.popover.close('.profile-popover', false);
  flogoutkonfirm()
});
}

function flogoutkonfirm()
{
      var dialog = app.dialog.create({
        content:''////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          +'<div style="width:100%;">'
          +'  <div style="display:flex;flex-direction:column;align-items:center;justify-content: center;">'
          +'      <img id="img" src="" style="width:150px;height:150px;margin: 10px 10px;object-fit: cover;">'
          +'      <p style="font-weight:normal;">Apkah anda yakin ingin logout?</p>'
          +'      <div class="data-table"></div>'
          +'  </div>'
          +'</div>',//////////////////////////////////////////////////////////////////////////////////////////////////
        closeByBackdropClick: false,
        destroyOnClose: true,
        verticalButtons: false,
        on: {
          opened: function () {
            //console.log('Dialog opened')
            let src = "icon512.png";
            $$('#img').attr('src',src);
          }
        },
        buttons: [
          {
            text: 'Nanti Saja',
            close:true,
            color: 'gray',
            onClick: function(dialog, e)
              {

              }
          },
          {
            text: 'Logout',
            close:true,
            color: 'red',
            onClick: function(dialog, e)
              {
                  flogoutrun();
                  localStorage.removeItem("mediterauser");
                  window.mediterausertoken = '';                  
                  $$('#overlay-welcome').css('display','flex');
              }
          },
        ]
      });
      dialog.open();
}

function flogoutrun()
{
  let mypreloader = app.dialog.preloader();
  app.request({
    url: apidataurl,
    method: 'POST',
    cache: false,
    data : { token:mediterausertoken, command: 'logout'}, 
    success: function (data, status, xhr)
      {
        mypreloader.close();
        var status = JSON.parse(data).status;
        var content = JSON.parse(data).data;
        if (status == "success")
        {
          //console.log(content);
          window.location.href = 'https://bsmijatim.org';
        }
        else if (status == "failed")
        {
          //console.log("failed");
          app.dialog.alert(content,'Terjadi Kesalahan');
        }
        else
        {
          //console.log("failed");
          //app.dialog.alert(content,'Terjadi Kesalahan');
          fcekexpiredtoken(content);
        }
      },
    error: function (xhr, status, message)
      {
        mypreloader.close();
        app.dialog.alert("Server sedang sibuk",'Terjadi Kesalahan');
      },
  })
}
///logout button/////////////////////////


//////dev mode/////////////////////////////////////////////////////////
if (isLocal)
{
  app.dialog.prompt('', 'DEV MODE', function (pwd){fdevmode(pwd);})
}

function fdevmode(pwd)
{
  let mypreloader = app.dialog.preloader();
  app.request({
    url: devmodeurl,
    method: 'POST',
    cache: false,
    data : { password: pwd}, 
    success: function (data, status, xhr)
      {
        console.log('devdata = '+data);
        mypreloader.close();

        var status = JSON.parse(data).status;
        var data = JSON.parse(data).data;
        if (status == "success")
        {
            //console.log(data);
            window.location.href = '/?access_token='+data;
        }
        else if (status == "failed")
        {
          app.dialog.alert(data,'Terjadi Kesalahan');
        }
        else
        {
          app.dialog.alert(data,'Terjadi Kesalahan');
        }
      },
    error: function (xhr, status, message)
      {
        //console.log(message);
        mypreloader.close();
        app.dialog.alert("Server sedang sibuk",'Terjadi Kesalahan');
      },
  })
}
///////dev mode/////////////////////////////////////////////////////////



///grecaptcha/////////////////////////////////
function grecaptcharesponse(data)
{
  //console.log(data);
  grecaptcharesponsedata = data;
}

function grecaptchaexpired()
{
  //console.log('expired');
  grecaptcharesponsedata = '';
}
///grecaptcha/////////////////////////////////



//////////myimage/////////////////////////////////////////
function myimage(data)
{
  //var src=data.src;
  var src=data;
  const para = document.createElement("div");
  para.innerHTML = '<div style="background: rgba(0, 0, 0, 0.8);position: fixed;z-index: 1000000000000000;align-items: center;justify-content: center;display: flex;bottom: 0;left: 0;right: 0;top: 0;"><img id="img" src="" style="border-radius: 1em;display: block;margin: auto;height: 90vh;width: 90vw;object-fit: contain;background-image:none;"></div>';
  
  para.addEventListener("click",()=>{
    para.remove(); 
  })

  document.body.appendChild(para);
  $$('#img').attr('src',src);

}
///////////myimage/////////////////////////////////////


/////////////////security///////////////////////////////////////
//https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

//https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
const escapeHTML = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

//https://stackoverflow.com/posts/30970751/revisions
function escapehtmloldbrowser(s) {
    let lookup = {
        '&': "&amp;",
        '"': "&quot;",
        '\'': "&apos;",
        '<': "&lt;",
        '>': "&gt;"
    };
    return s.replace( /[&"'<>]/g, c => lookup[c] );
}

//https://stackoverflow.com/a/31637900
//encode all
function encodeall(e){return e.replace(/[^]/g,function(e){return"&#"+e.charCodeAt(0)+";"})}

//https://stackoverflow.com/a/34481254
//encode non alphanumeric
function encodenonalphanumeric( s )
{
    var h,
        i,
        n,
        c;

    n = s.length;
    h = '';

    for( i = 0; i < n; i++ )
    {
        c = s.charCodeAt( i );
        if( ( c >= 48 && c <= 57 ) 
          ||( c >= 65 && c <= 90 ) 
          ||( c >= 97 && c <=122 )
          ||( c == 32 ) )
        {
            h += String.fromCharCode( c );
        }
        else
        {
            h += '&#' + c + ';';
        }
    }

    return h;
}

function ftrustedHTML(data)
{
    data = String(data);
    let unescapefist = {
        "&amp;": '&',
        "&quot;": '"',
        "&apos;": '\'',
        "&lt;": '<',
        "&gt;": '>'
    };
    let danger = data.replace( /[&"'<>]/g, c => unescapefist[c] );
    let lookup = {
        '&': "&amp;",
        '"': "&quot;",
        '\'': "&apos;",
        '<': "&lt;",
        '>': "&gt;"
    };
    let safehtml = danger.replace( /[&"'<>]/g, c => lookup[c] );
    return safehtml;

}

function dangernotsafe(data)
{
  return data;
}

function safe(unsafe)
{
unsafe = String(unsafe);
var data = escapehtmloldbrowser(unsafe);
return data;

}

function safegetparam(unsafe)
{
var data = encodeURIComponent(unsafe)
return data;
}


/////////////////////////////////////////////////////////////////





///////fpageadmin();///////////////////////////////////////////
function fpageadmin()
{
  if (typeof mediteraadmindata === 'undefined' || mediteraadmindata === null)
  {
      let mypreloader = app.dialog.preloader();
      app.request({
        url: apidataurl,
        method: 'POST',
        cache: false,
        data : { password:'passwordtest', command: 'admingetalldata'}, 
        success: function (data, status, xhr)
          {
            mypreloader.close();
            var status = JSON.parse(data).status;
            var content = JSON.parse(data).data;
            if (status == "success")
            {
              //console.log(content);
              window.mediteraadmindata = content;
              fpageadminrun(content);
            }
            else if (status == "failed")
            {
              //console.log("failed");
              app.dialog.alert(content,'Terjadi Kesalahan');
            }
            else
            {
              //console.log("failed");
              //app.dialog.alert(content,'Terjadi Kesalahan');
            }
          },
        error: function (xhr, status, message)
          {
            //console.log(message);
            mypreloader.close();
            app.dialog.alert("Server sedang sibuk",'Terjadi Kesalahan');
          },
      })
  }
  else
  {
    fpageadminrun(mediteraadmindata);
  }

  $$('.meditera-adminrefresh').on('click', function () {
    $$('.meditera-tambahperangkat').off('click');
    mediteraadmindata = null
    fpageadmin()
  })
}

function fpageadminrun(content)
{
  var data = '<div class="data-table data-table-collapsible data-table-init"><table><thead><tr><th>Kode</th><th>Nama</th><th></th></tr></thead><tbody>';
  for (i=content.length-1;i>0;i--)
  {
      
      data += '<tr class="meditera-admin-item-'+safe(content[i][1])+'"><td data-collapsible-title="Kode">'+safe(content[i][2])+'</td><td data-collapsible-title="Nama">'+safe(content[i][3])+'</td><td><a class="button button-fill meditera-adminaction" data-user="'+btoa(JSON.stringify(content[i]))+'">Detail</a></td></tr>';
  }
  data += '</tbody></table></div>';
  $$('.meditera-admin').html(data);

  $$('.meditera-admin a.meditera-adminaction').on('click', function (e) {
        
        //app.dialog.confirm('Pembuatan e-KTA memerlukan waktu 2-4 menit.', 'Pemberitahuan', function (){fbuatekta();})
        var base64 = this.attributes["data-user"].value;
        fpageadmindetail(base64)
  });
  
  $$('.meditera-tambahperangkat').on('click', function (e) {
    ftambahperangkat();
    //console.log('tambah');
  });
}

function fpageadmindetail(base64)
{
  var data = atob(base64);data = JSON.parse(data);
  var dialog = app.dialog.create({
    title: 'Data Perangkat',
    content:''////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      +'<div style="width:100%;height:50vh;overflow:auto;">'
      +'  <div style="display:flex;flex-direction:column;align-items:center;justify-content: center;">'
      +'      <img class="imgdetail" src="" style="width:150px;height:150px;margin: 10px 10px;border-radius: 50%;object-fit: cover;">'
      +'      <p style="font-weight:bold;"></p>'
      +'      <div class="data-table"><table><tbody>'
      +'          <tr><td>Uid</td><td>'+safe(data[1])+'</td></tr>'
      +'          <tr><td>Kode</td><td>'+safe(data[2])+'</td></tr>'
      +'          <tr><td>Nama</td><td>'+safe(data[3])+'</td></tr>'
      //+'          <tr><td>Kalibrasi</td><td>'+safe(data[4])+'</td></tr>'
      //+'          <tr><td>Status</td><td>'+safe(data[5])+'</td></tr>'
      //+'          <tr><td>Kondisi</td><td>'+safe(data[6])+'</td></tr>'
      //+'          <tr><td>Photo</td><td><a href="#">'+safe(data[7])+'</a></td></tr>'
      +'          <tr><td>QR</td><td><a class="kodeqr" href="#">Kode QR</a></td></tr>'
      +'      </tbody></table></div>'
      +'  </div>'
      +'</div>',//////////////////////////////////////////////////////////////////////////////////////////////////
    closeByBackdropClick: false,
    destroyOnClose: true,
    verticalButtons: true,
    on: {
      opened: function () {
        //console.log('Dialog opened')
        let src = "https://drive.google.com/uc?export=view&id="+safe(data[7]);
        $$('.imgdetail').attr('src',src);
        let srcqr = "https://drive.google.com/uc?export=view&id="+safe(data[8]);
        $$('.kodeqr').on('click', function (e) {
          myimage(srcqr);
        });
      }
    },
    buttons: [
      {
        text: 'Tutup',
        close:true,
        color: 'gray',
        onClick: function(dialog, e)
          {

          }
      },
    ]
  });
  dialog.open();
}

function ftambahperangkat()
{
  var dialog = app.dialog.create({
    title: 'Tambah Perangkat',
    closeByBackdropClick: false,
    destroyOnClose: true,
    content: '<div style="width:100%;height:60vh;overflow:auto;">'
      +'<form id="meditera-formtambahperangkat" runat="server" style="display:flex;flex-direction:column;align-items:center;justify-content: center;">'
      +'  <img id="mediterauploadphotopreview" src="photo.svg" style="width:200px;height:150px;margin: 10px 10px;object-fit: contain;">'
      +'  <input accept="image/jpeg" type="file" name="mediterauploadphoto" id="mediterauploadphoto" required validate/>'
      +'  <div class="list no-hairlines-md">'
      +'    <ul>'
      +'        <li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap">'
      +'            Isi Data Perangkat'
      +'            </div></div>'
      +'        </li>'
      +'        <li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap">'
      +'            <input type="text" name="kode" placeholder="Kode" required validate/>'
      +'            </div></div>'
      +'        </li>'
      +'        <li class="item-content item-input"><div class="item-inner"><div class="item-input-wrap">'
      +'            <input type="text" name="nama" placeholder="Nama" required validate/>'
      +'            </div></div>'
      +'        </li>'
      +'    </ul>'
      +'  </div>'
      +'</form>'
      +'</div>',
    on: {
      opened: function () {
          mediterauploadphoto.onchange = evt => {
            const [file] = mediterauploadphoto.files
            if (file) {
              if (file.size > 524288)
              {
                //app.dialog.alert('File tidak boleh lebih dari 500 KB','Terjadi Kesalahan');
                var toastBottom = app.toast.create({ text: 'File tidak boleh lebih dari 500 KB', closeTimeout: 5000,position: 'center', });toastBottom.open();
                mediterauploadphoto.value = '';
                mediterauploadphotopreview.src = 'photo.svg'
              }
              else
              {
                mediterauploadphotopreview.src = URL.createObjectURL(file)
              }
            }
            else
            {
              mediterauploadphotopreview.src = 'photo.svg'
            }
          }
      }
    },
    buttons: [
      {
        text: 'Batal',
        close:true,
        color: 'gray',
        onClick: function(dialog, e)
          {
          }
      },
      {
        text: 'Tambah',
        close:false,
        onClick: function(dialog, e)
          {            
            const [file] = mediterauploadphoto.files
            if (file) {
              if (!$$('#meditera-formtambahperangkat')[0].checkValidity()) {
                    //console.log('Check Validity!');
                    return;
              }
              var dataform = JSON.stringify(app.form.convertToData('#meditera-formtambahperangkat'));//console.log(dataform);
              const fr = new FileReader();
              fr.onload = function(e) {
                const obj = {
                  filename: file.name,
                  mimeType: file.type,
                  bytes: [...new Int8Array(e.target.result)],
                  perangkat: dataform
                };
                fkirimtambahperangkat(dialog,obj);
              };
              fr.readAsArrayBuffer(file);
            }
            else
            {
              var toastBottom = app.toast.create({ text: 'Pilih file photo', closeTimeout: 5000,position: 'center', });toastBottom.open();
            }
          }
      },
    ]
  });
  dialog.open();
}

function fkirimtambahperangkat(dialog,obj)
{
  //console.log(obj);
  var data = JSON.stringify(obj);
  dialog.close();
  let mypreloader = app.dialog.preloader();
  app.request({
    url: apidataurl,
    method: 'POST',
    cache: false,
    data : { password:'passwordtest', command: 'admintambahperangkat', data: data}, 
    success: function (data, status, xhr)
      {
        mypreloader.close();        
        var status = JSON.parse(data).status;
        var content = JSON.parse(data).data;
        if (status == "success")
        {
          console.log('kirim sukses');
          //app.dialog.alert("Permintaan verifikasi telah terkirim. Proses verifikasi bisa membutuhkan beberapa hari. Terima kasih.",'Permintaan Verifikasi');
          mediteraadmindata = null
          fpageadmin(); 
          let srcqr = "https://drive.google.com/uc?export=view&id="+content;
          myimage(srcqr);       
        }
        else if (status == "failed")
        {
          //console.log("failed");
          app.dialog.alert(content,'Terjadi Kesalahan');
        }
        else
        {
          //console.log("failed");
          //app.dialog.alert(content,'Terjadi Kesalahan');
        }
      },
    error: function (xhr, status, message)
      {
        //console.log(message);
        mypreloader.close();
        dialog.close();
        app.dialog.alert("Server sedang sibuk",'Terjadi Kesalahan');
      },
  });
}
///////fpageadmin////////////////////////////////////////////////////////



//////fdownloadfile/////////////////////////////////////////////////////////////////////
//https://itnext.io/how-to-download-files-with-javascript-d5a69b749896
function fdownloadfile(IMG_URL,FILE_NAME)
{
  const startTime = new Date().getTime();

  request = new XMLHttpRequest();

  request.responseType = "blob";
  request.open("get", IMG_URL, true);
  request.send();
  
  let mypreloader = app.dialog.preloader('Downloading ...');

  request.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {
      const imageURL = window.URL.createObjectURL(this.response);

      const anchor = document.createElement("a");
      anchor.setAttribute('href', imageURL);
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('download', FILE_NAME);
      anchor.click();
      mypreloader.close();
      app.dialog.alert("Download Selesai",'Info');
    }
  };

  request.onprogress = function (e) {
    const percent_complete = Math.floor((e.loaded / e.total) * 100);

    const duration = (new Date().getTime() - startTime) / 1000;
    const bps = e.loaded / duration;

    const kbps = Math.floor(bps / 1024);

    const time = (e.total - e.loaded) / bps;
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60);

    console.log(
      //`${percent_complete}% - ${kbps} Kbps - ${minutes} min ${seconds} sec remaining`
    );
  };
}

async function fdownloadfile1(IMG_URL,FILE_NAME) {
  const image = await fetch(IMG_URL);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const anchor = document.createElement("a");
  anchor.setAttribute('download', FILE_NAME);
  anchor.setAttribute('href', imageURL);
  anchor.setAttribute('target', '_blank');

  anchor.click();

  URL.revokeObjectURL(imageURL);
}


function fdownloadfile2(url, fileName){
  fetch(url, { method: 'get'})
    .then(res => res.blob())
    .then(res => {
      const aElement = document.createElement('a');
      aElement.setAttribute('download', fileName);
      const href = URL.createObjectURL(res);
      aElement.setAttribute('href', href);
      aElement.setAttribute('target', '_blank');
      aElement.click();
      URL.revokeObjectURL(href);
    });
};
//////fdownloadfile/////////////////////////////////////////////////////////////////////


/////////myviewer/////////////////////////////////////////////////////////////////////////////

function myviewer(data)
{
  
    var dynamicPopup = app.popup.create({
      content: '<div class="popup" style="background:#fff">'+
      '<div class="block">'+
      
        '<iframe id="meditera-iframe" src="'+safe(data)+'" style="display: block;margin: auto;height: 80vh;width: 90%;object-fit: contain;background-image:none;background:#fff;"></iframe>'+
        '<div style="height:10vh;width:90vw;" class="text-align-center"><a href="#" class="item-link list-button actions-close popup-close">Tutup</a></div>'+
        
       '</div></div>',
    });     
    dynamicPopup.open();
    //$$('#meditera-iframe').attr('src',data);
    let mypreloader = app.dialog.preloader();
    setTimeout(function () {mypreloader.close();}, 3000);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////



////////serviceworker////////////////////////////////////////////////////////////////////////////////////////////////

  if (typeof navigator.serviceWorker !== 'undefined') {
    navigator.serviceWorker.register('sw.js')
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////


///////online offline/////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus(event) {
  var condition = navigator.onLine ? "online" : "offline";
  if (condition == 'offline')
  {
      window.mediterapreloader = app.dialog.progress('Koneksi Terputus');
  }
  if (condition == 'online')
  {
      window.mediterapreloader.close();
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////fmediterafitur()/////////////////////////////////////////////////////////////////////
function fmediterafitur()
{
  $$('.meditera-fitur-item').on('click', function (e) {
    let data = $$(this).attr('data-item');
    console.log(data);
    window.mediterafiturdata = data;
    fopenscanner(data);
  });
}

function fopenscanner()
{
  const para = document.createElement("div");
  para.classList.add('meditera-scanner');
  para.innerHTML = '<div style="background: rgba(0, 0, 0, 0.8);position: fixed;z-index: 1000000000000000;align-items: center;justify-content: center;display: flex;bottom: 0;left: 0;right: 0;top: 0;"><div id="reader" src="" style="display: block;margin: auto;height: 90vh;width: 90vw;object-fit: contain;background-image:none;"></div></div>';
  
  para.addEventListener("click",()=>{
    para.remove(); 
  })

  document.body.appendChild(para);

  window.html5QrCode = new Html5Qrcode("reader");
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };
  html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
}

function qrCodeSuccessCallback(decodedText, decodedResult) {
  // handle the scanned code as you like, for example:
  console.log(`Code matched = ${decodedText}`, decodedResult);
  html5QrCode.stop().then((ignore) => {
    // QR Code scanning is stopped.
  }).catch((err) => {
    // Stop failed, handle it.
  });
  $$('.meditera-scanner').remove();
  fbukafitur(mediterafiturdata,decodedText);
}

function onScanFailure(error) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  console.warn(`Code scan error = ${error}`);
}

function fbukafitur(mediterafiturdata,decodedText)
{
  console.log(mediterafiturdata);
  console.log(decodedText);
}
///////fmediterafitur()/////////////////////////////////////////////////////////////////