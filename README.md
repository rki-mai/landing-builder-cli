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
    "styles": { "fontSize": "16" }
  }
]
```

Поддерживаемые типы `element`: `text`, `container`, `link`, `image`, `button`.

Связи задаются полями `parentId` (`"root"` — верхний уровень) и `index` (порядок среди соседей). Поле `style` и `styles` эквивалентны.

## Использование

### Установка утилиты

1. Создайте директорию, в которой будет располагаться утилита

   ```bash
   mkdir -p landing-builder-cli
   ```

1. Скачайте утилиту `landing-builder-cli` из [последнего релиза](https://github.com/rki-mai/landing-builder-cli/releases/latest).
   И переместите ее в созданную директорию.

1. Подготовьте окружение для утилиты через вызов следующей команды

   ```bash
   landing-builder-cli/landing-builder-cli install
   ```

### Сборка проекта

Для сборки проекта из файла черновика достаточно вызвать следующую команду

```bash
landing-builder-cli --draft examples/storage-sample.json --output dist
```

В результате будет создана директория `dist`, где будут находиться все собранные
статические файлы.

## Структура

```
landing-builder-cli/
├── template-project     # Astro-проект, играющий роль шаблона для лендингов
├── landing-builder-cli  # CLI-обертка для генерации лендингов на основе проекта-шаблона
├── README.md
└── examples/
    └── storage-sample.json
```

## Связь с wb-landing-builder

Сейчас бэкенд `wb-landing-builder` сохраняет ответ storage во временный файл и запускать эту CLI перед загрузкой в S3.

Справка по формату элементов: [ADR «Формат изменений черновика»](../docs/ADRs/Формат%20Изменений%20Черновика.md).
