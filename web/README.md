# Описание фронтенда

Все файлы размещен в папке `web`, исходные файлы в директории `web/src`.

Фронтенд собирается gulp'ом, поэтому для начала работы, необходимо установить `gulp` и все пакеты из `packages.json`:
```
npm install -g gulp
npm install
```

### Технологии
Условились использовать следующие:
* SASS для стилей
* Jade в качестве шаблонизатора
* Пока чисто JS с jQuery, возможно, все переиграем

## gulp-таски

Каждый таск помещен в отдельный файл в папке `web/gulp/tasks`.

### Доступные gulp-таски
* `gulp`, `gulp default` — запускаются по очереди таски `build`, `webserver`, `watch`
* `gulp build` — полная сборка проекта, выполняются `fonts`, `images`, `styles`, `scripts`, `templates`
* `gulp fonts` — копирет все файлы из папки `config.path.src.font`
* `gulp images` — копируем все картинки и сжимает `imagemin`, если работает в режиме `--production`
* `gulp styles` — прогоняем все sass, scss, css файлы через sass компилятор, если работаем в режиме `--production`, то файлы дополнительно минифицируются и создается sourcemap
* `gulp scripts` — сейчас файлы со скриптами проходят через `rigger`, который ищет директивы вида `//= chat.js` и вставляет соответствующий файл, в ближайшее время предлагаю перейти на `webpack`
* `gulp templates` — преобразует jade шаблон в html, если передан параметр --production, то код минифицируется
* `gulp watch` — следит за изменениями в файлах, если видит, то запускает таск и обновляет страницу
* `gulp webserver` — запускаем веб-сервер localhost:8888

### Настройка

Все настройки находятся в файле `web/gulp/config.js`. В них указано для каждой технологии пути к соответствующим
исходникам, а также директории в которые поместить собранный файл. Так же в конфиге прописаны настрйки для сервера, который поднимается при запуске команды `gulp webserver`, по-умолчанию http://localhost:8888/

## Режимы сборки

Если gulp запускается с параметром `--production` (пример, `gulp --production`), то в зависимости от технологии с файлами происходит дополнительная обработка, обычно это минификация и создания sourcemap.

__По-умолчанию все таски выполняются в режиме `develop`__, как если бы они были замущены с параметром `gulp --develop`

## Файловая структура фронтенд части
```
├── src
│   ├── js
│   ├── style
│   │   ├── blocks
│   │   │   ├── chat
│   │   │   │   ├── index.sass
│   │   │   │   └── input.sass
│   │   │   └── page.sass
│   │   ├── helpers
│   │   │   ├── reset.sass
│   │   │   └── varibales.sass
│   │   └── main.scss
│   └── templates
│       ├── blocks
│       │   └── message.jade
│       ├── index.jade
│       ├── layouts
│       │   └── default.jade
│       └── mixins
│           └── avatar.jade
├── gulp
│   ├── config.js
│   ├── errorHandler.js
│   └── tasks
│       ├── clean.js
│       ├── default.js
│       ├── fonts.js
│       ├── images.js
│       ├── scripts.js
│       ├── styles.js
│       ├── templates.js
│       ├── watch.js
│       └── webserver.js
├── build
├── gulpfile.js
├── package.json
├── README.md
```
