# landing-builder-cli

CLI-утилита для генерации HTML из JSON-снимка черновика **storage**-компоненты.

## Входной формат

Тот же JSON, что возвращает:

`GET /api/v1/storage/{project_id}`

— **массив объектов** (результат `collapseMutations`), например:

```json
[
  {
    "element": "text",
    "id": "lb-1",
    "parentId": "root",
    "index": 0,
    "value": "Привет",
    "styles": { "fontSize": "16px" }
  }
]
```

Поддерживаемые типы `element`: `text`, `container`, `link`, `image`, `button`.

Связи задаются полями `parentId` (`"root"` — верхний уровень) и `index` (порядок среди соседей). Поле `style` и `styles` эквивалентны.

Элементы с `"deleted": true` пропускаются.

## Использование

```bash
python3 generate.py --draft draft.json --output page.html
```

Опционально: `--title "Название страницы"`.

## Пример

```bash
python3 generate.py \
  --draft examples/storage-sample.json \
  --output /tmp/landing.html
```

## Структура

```
landing-builder-cli/
├── generate.py      # точка входа CLI
├── renderer.py      # JSON (storage) → HTML
├── README.md
└── examples/
    └── storage-sample.json
```

## Связь с wb-landing-builder

Сейчас утилита **автономна**: бэкенд её не вызывает. Позже `wb-landing-builder` будет сохранять ответ storage во временный файл и запускать эту CLI перед загрузкой в S3.

Справка по формату элементов: [ADR «Формат изменений черновика»](../docs/ADRs/Формат%20Изменений%20Черновика.md).
