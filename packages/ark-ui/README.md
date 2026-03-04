# @bazel-digital/ark-ui

A **shared React component library** designed for churches across the **SoldOut Movement**, with a focus on visual **unity**, **design consistency**, and easy integration into sites built on **React Bricks**.

This package provides reusable bricks (React components with schema) tailored for use within React Bricks CMS-powered church websites, including layouts, hero sections, content blocks, and more.


## ✨ Purpose

Churches in the SoldOut Movement are united in purpose and mission. This shared UI library reinforces that unity by enabling:

- ✅ A consistent design language across all church websites
- ✅ Reusability of components across multiple React Bricks projects
- ✅ Faster onboarding and launch of new church sites
- ✅ Flexibility to override or extend styles locally if needed


## 🧱 Built for React Bricks

All components in this library are **React Bricks-compatible bricks** — meaning each component includes its schema and can be registered directly in your `react-bricks.config.ts` file.

You **must** be using [React Bricks](https://reactbricks.com/) to take full advantage of this package.


## 🚀 Installation

First, authenticate with GitHub Packages by creating a `.npmrc` file:

```ini
@bazel-digital:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN

Then install:

npm install @bazel-digital/ark-ui
```


## 📦 Usage
Import bricks into your project like so:

```
import { Hero, Footer, TextSection } from '@bazel-digital/ark-ui'
```

You can then register them in your react-bricks.config.ts:

```
import * as ArkBricks from '@bazel-digital/ark-ui'

export const config = {
  ...,
  bricks: [
    ArkBricks.Hero,
    ArkBricks.Footer,
    ArkBricks.TextSection,
    // etc.
  ]
}
```



## 💡 Design Philosophy: Unity Through Consistency

This library aims to reflect the unity of our global fellowship by maintaining a consistent look and feel across all our church websites.

Please avoid unnecessary local styling overrides unless absolutely necessary. If you do need to override a component, consider wrapping it rather than modifying it directly.



## 📁 Available Components
	•	Hero
	•	Footer
	•	TextSection
	•	VideoHero
	•	Profile
	•	ItemGrid
	•	Timeline
	•	and more…

New components will be added as needs emerge across different regions.

## 🤝 Contributing

This package is maintained by Bazel Digital and is intended to serve all churches in the European World Sector (and beyond).

To contribute:
1.	Clone the repository
2.	Run npm install
3.	Run npm link to develop locally
4.	Submit a pull request with clear purpose and documentation



## 🧾 License

MIT — free to use and distribute within the SoldOut Movement



## 📬 Contact

For questions, support, or to request a new component:
* Email: aaron.baw@usd21.org
* GitHub: @bazel-digital

