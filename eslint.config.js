// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
    expoConfig,
    {
        ignores: ["dist/*"],
    },
    {
        rules: {
            "no-console": "error",
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        "CallExpression[callee.type='MemberExpression'][callee.object.name=/(^[Ll]og$|[Ll]ogger)/]",
                    message:
                        "Remove logger calls before committing to production.",
                },
            ],
        },
    },
]);
