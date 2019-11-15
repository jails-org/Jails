module.exports = {
	"parser":"babel-eslint",
	"rules": {
		"indent": [2,"tab", {"SwitchCase":1}],
		"quotes": [2,"single"],
		"semi": [2,"never"],
		"no-unused-vars": ["warn", { "vars": "all", "args": "none" }],
		"no-console": 0
	},
	"env": {
		"es6": true,
		"browser": true,
		"node" : true,
		"jquery": true,
	},
	"extends": "eslint:recommended",
	 "parserOptions": {
		"sourceType": "module",
		"ecmaVersion": 2017,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
	},
	"globals":{
		"APPCONFIG":true,
		"webcomponents":true
	}
}
