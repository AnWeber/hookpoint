# hookPoint

> hooks system for custom plugins

## Installation

```shell
npm install hookpoint
```


## Hook types

Each hook triggers every added function in a loop. 

* __SeriesHook__. This hook simply calls every function added in a row.

* __LastOutHook__. A bail hook allows exiting early. When any of the tapped function returns anything, the bail hook will stop executing the remaining ones.

* __Waterfall__. A waterfall hook also calls each added function in a row. It passes a return value from each function to the next function.

All hooks allow exiting early. To exit early a method must be passed to the constructor for detecting this case.


## Usage

All Hook constructors take one optional argument, which is a list of argument names as strings.

``` typescript
const hook = new SeriesHook<[string, number], boolean>();
```

The best practice is to expose all hooks of a class in a `hooks` property:

``` typescript
class HttpFile {
	constructor() {
		this.hooks = {
			parse: new SeriesHook<[String, ParseContext], ParseResult>(),
			replaceVariables: new WaterfallHook<[string, ReplaceVariableContext], string>()
		};
	}
}
```

Other people can now use these hooks:

``` typescript
const httpFile = new HttpFile();
httpFile.hooks.parse.addHook("javascript", (text, context) => addExecuteAction(text));
```

> It's required to pass a id to identify the plugin/reason.


## Interception

All Hooks offer an additional [interception API](https://github.com/AnWeber/hookpoint/blob/main/src/models/hookInterceptor.ts):

``` typescript
httpFile.hooks.parse.addInterceptor({
	 beforeLoop: async function checkUserCancellation(
      hookContext: models.HookTriggerContext<[models.ProcessorContext], boolean>
    ) {
      const context = hookContext.args[0];
      if (context.progress?.isCanceled?.()) {
        log.trace('process canceled by user');
        return false;
      }
      return true;
    },
})
```

## License

[MIT License](LICENSE)

## Change Log

[CHANGELOG](CHANGELOG.md)
