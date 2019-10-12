'use strict';
document.addEventListener('DOMContentLoaded', ()=>{
    // keyboard
    {
        const keyboardButton = document.querySelector('.search-form__keyboard');
        const keyboard = document.querySelector('.keyboard');
        const searchInput = document.querySelector('.search-form__input');
        const keyboardClose = document.getElementById('close-keyboard');
        const backspace = document.getElementById('keyboard-backspace');
        
        const toggleKeyboard = () => {
            keyboard.style.top = keyboard.style.top ? '' : '50%';
        }

        const changeLang = (btn, lang) => {
            const langRu = ['ё', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
                'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
                'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
                'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
                'en', ' '
            ];
            const langEn = ['`', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
                'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
                'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '"',
                'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
                'ru', ' '
            ];

            if(lang === 'en'){
                btn.forEach((elem, i) =>{
                    elem.textContent = langEn[i];
                })
            } else {
                btn.forEach((elem, i) =>{
                    elem.textContent = langRu[i];
                })
            }
        }

        const typing = (e) => {
            const target = e.target;
            if(target.tagName.toLowerCase() === 'button'){
                const contentButtons = target.textContent.trim()
                const buttons = [...keyboard.querySelectorAll('button')]
                    .filter(elem => elem.style.visibility !== 'hidden')

                if(contentButtons === '⬅') {
                    searchInput.value = searchInput.value.slice(0, -1);
                } else if (!contentButtons) {
                    searchInput.value += ' ';
                } else if (contentButtons === 'en' || contentButtons === 'ru') {
                    changeLang(buttons, contentButtons)
                } else {
                    searchInput.value += contentButtons;
                    
                }
            }
        }

        keyboardButton.addEventListener('click', toggleKeyboard);

        keyboardClose.addEventListener('click', toggleKeyboard);

        keyboard.addEventListener('click', typing);

    }

    // sidebar
    {
        const burger = document.querySelector('.spinner');
        const sidebarMenu = document.querySelector('.sidebarMenu');

        burger.addEventListener('click', () => {
            burger.classList.toggle('active')
            sidebarMenu.classList.toggle('rollUp')
        });

        sidebarMenu.addEventListener('click', (e) => {
            let target = e.target;
            target = target.closest('a[href="#"');

            if(target) {
                const parentTarget = target.parentElement;
                sidebarMenu.querySelectorAll('li').forEach((i) => {
                    if(i === parentTarget) {
                        i.classList.add('active');
                    } else {
                        i.classList.remove('active');
                    }
                })
            }
        })
    }

    // modal window
    const youtuber = () => {
        
        const youtuberModal = document.querySelector('.youTuberModal');
        const youtuberItems = document.querySelectorAll('[data-youtuber]');
        const youtuberContainer = document.getElementById('youtuberContainer');
        const qw = [3840, 2560, 1920, 1280, 854, 640, 426, 256];
        const qh = [2160, 1440, 1080, 720, 480, 360, 240, 144];

        const sizeVideo = () => {
            let ww = document.documentElement.clientWidth;
            let wh = document.documentElement.clientHeight;

            for (let i = 0; i < qw.length; i ++){
                if(ww > qw[i]){
                    youtuberContainer.querySelector('iframe').style.cssText = `
                        width: ${qw[i]}px;
                        height: ${qh[i]}px;
                    `;
                    youtuberContainer.style.cssText = `
                        width: ${qw[i]}px;
                        height: ${qh[i]}px;
                        top: ${(wh - qh[i])/2}px;
                        left: ${(ww - qw[i])/2}px;
                    `;
                    break;
                }
            }
        }

        youtuberItems.forEach(elem => {
            elem.addEventListener('click', () => {
                const idVideo = elem.dataset.youtuber;
                youtuberModal.style.display = 'block';

                const youtuberFrame = document.createElement('iframe');
                youtuberFrame.src = `https://youtube.com/embed/${idVideo}`;
                youtuberContainer.insertAdjacentElement('beforeend', youtuberFrame);
                
                window.addEventListener('resize', sizeVideo)
                
                sizeVideo();
            })
        })

        youtuberModal.addEventListener('click', () => {
            youtuberModal.style.display = '';
            youtuberContainer.textContent = '';
            window.removeEventListener('resize', sizeVideo)

        });
    }

    {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="youTuberModal">
                <div id="youtuberClose">&#215;</div>
                <div id="youtuberContainer"></div>
            </div>
        `);

        youtuber();
    }
    // API

    {
        const API_KEY = 'AIzaSyCsZ4-NzgizzH5nxT223ud6J_2DC-5AlDs';
        const CLIENT_ID = '953603643683-n2pvjun17ldjcnt7sp2t5m8mgcl8iune.apps.googleusercontent.com';

        //registration
        {
            const buttonAuth = document.getElementById('authorize');
            const blockAuth = document.querySelector('.auth');

            gapi.load("client:auth2", function() {
                gapi.auth2.init({client_id: CLIENT_ID});
            });

            function authenticate() {
                return gapi.auth2.getAuthInstance()
                    .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
                    .then(function() {
                         console.log("Sign-in successful"); 
                         blockAuth.style.display = 'none';
                    },
                          function(err) { console.error("Error signing in", err); });
              }
              function loadClient() {
                gapi.client.setApiKey(API_KEY);
                return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
                    .then(function() { console.log("GAPI client loaded for API"); },
                          function(err) { console.error("Error loading GAPI client for API", err); });
              }
         
              buttonAuth.addEventListener('click', () => {
                authenticate().then(loadClient);
              });
        }

        //request
        {
            const gloTube = document.querySelector('.logo-academy')
            const ytSubscriptions = document.getElementById('subscriptions')
            const ytTrends = document.getElementById('yt_trend')
            const ytLike = document.getElementById('yt_like')
            const ytSearch = document.querySelector('.search-form')
            const ytNext = document.getElementById('next_result')


            const  request = options => gapi.client.youtube[options.method]
            .list(options)
            .then(response => response.result)
            .then(data => options.method === "subscriptions" ? renderSub(data) : render(data))
            .catch(err => console.error('error' + err))
            

            const renderSub = data =>{
                console.log(data)
                const ytWrapper = document.getElementById('yt-wrapper');

                ytWrapper.textContent = '';

                data.items.forEach(i => {
                    try {
                        const {
                            snippet: {
                                resourceId:{
                                    channelId
                                },
                                desciptions,
                                title,
                                thumbnails:{
                                    high:{
                                        url
                                    }
                                }
                            },
                        } = i;
                        ytWrapper.innerHTML += `
                            <div class="yt" data-youtuber="${channelId}">
                                <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                                    <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
                                </div>
                                <div class="yt-title">${title}</div>
                                <div class="yt-channel">${desciptions}</div>
                            </div>
                        `
                    } catch (err) {
                        console.error(err)
                    }
                });

                ytWrapper.querySelectorAll('.yt').forEach(item => {
                    item.addEventListener('click', () => {
                        request({
                            method: 'search',
                            part: 'snippet',
                            channelId: item.dataset.youtuber,
                            order: 'date',
                            maxResults:9
                        });
                    })
                })
            }
            
            const render = data =>{
                console.log(data)
                const ytWrapper = document.getElementById('yt-wrapper');
                
                ytWrapper.textContent = '';

                data.items.forEach(i => {
                    try {
                        const {
                            id,
                            id:{
                                videoId
                            },
                            snippet:{
                                channelTitle,
                                title,
                                resourceId:{
                                    videoId: likedVideoId
                                } = {},
                                thumbnails:{
                                    high:{
                                        url
                                    }
                                }
                            }
                        } = i;
                        
                        ytWrapper.innerHTML += `
                            <div class="yt" data-youtuber="${likedVideoId || videoId || id}">
                                <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                                    <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
                                </div>
                                <div class="yt-title">${title}</div>
                                <div class="yt-channel">${channelTitle}</div>
                            </div>
                        `
                        
                    } catch (err) {
                        console.error(err)
                    }
                });

                youtuber();
            }

            gloTube.addEventListener('click', () => {
                request({
                    method: 'search',
                    part: 'snippet',
                    channelId: 'UCVswRUcKC-M35RzgPRv8qUg',
                    order: 'date',
                    maxResults:9
                });
            });

            ytSubscriptions.addEventListener('click', () => {
                request({
                    method: 'subscriptions',
                    part: 'snippet',
                    mine: true,
                    maxResults:9
                });
            });

            ytTrends.addEventListener('click', () => {
                request({
                    method: 'videos',
                    part: 'snippet',
                    chart: 'mostPopular',
                    mine: true,
                    maxResults:9,
                });
            });

            ytLike.addEventListener('click', () => {
                request({
                    method: 'playlistItems',
                    part: 'snippet',
                    playlistId: 'LLU4-aThlzHaRF6sf6MatQJg',
                    maxResults:9,
                });
            });

            ytSearch.addEventListener('submit', (e) => {
                e.preventDefault();
                let valueInput = ytSearch.elements[0].value
                if(!valueInput) {
                    ytSearch.style.border = '1px solid red'
                    return
                }
                ytSearch.style.border = ''
                request({
                    method: 'search',
                    part: 'snippet',
                    order: 'relevance',
                    maxResults:9,
                    q: valueInput
                });

                ytSearch.elements[0].value = '';
            });

            
        }
    }

});

