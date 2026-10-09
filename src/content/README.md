# Editing site content

All text on the website lives in the `.json` files in this folder. Edit the text between the quotes; do not touch the code.

| File | What it controls |
|---|---|
| `site.json` | Company name, email, phone, office cities, menu links, footer |
| `home.json` | Home page browser title and search description |
| `hero.json` | Top of the home page, including the cap-table card |
| `paths.json` | "What brings you to UEMS?" cards |
| `services.json` | The four service tabs and their example trackers |
| `process.json` | "How an engagement works" steps |
| `industries.json` | The industry orbit |
| `clarity.json` | The "Equity shouldn't look like this" scroll section |
| `lifecycle.json` | Lifecycle timeline stages |
| `why.json` | "Precision is the product" reasons |
| `faq.json` | Questions and answers |
| `cta.json` | The closing "Your equity. Structured." block |
| `about.json` | The whole About page |
| `contact.json` | The Contact page and its form |

## Rules
- **Emphasis:** wrap words in `*asterisks*` to get the styled italic, e.g. `"*simplified* for every"`.
- **Headlines** are lists; each entry is one line of the headline.
- **Offices:** edit once in `site.json`; the hero, footer, menu and contact page follow. `{offices}` in a text means "insert the office list".
- **Lists** (FAQ items, services, stages): copy an existing entry, including its commas, to add one. The `id` fields must be unique, lowercase, no spaces.
- **Fixed counts:** a few places need an exact number of items (3 hero trust points, 3 cap-table holders, 3 values). The build reports which file and field is wrong.
- Keep the quotes and commas valid JSON; a mistake makes the build fail with the file name.
