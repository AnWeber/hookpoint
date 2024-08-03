## 4.1.0 (2024-08-03)

### Feature
- add error to onError handler

## 4.0.1 (2024-05-01)

### Fix
- ensureUniqueId on merge (Anweber/vscode-httpyac#280)

## 4.0.0 (2023-10-29)

#### Feature

- add onError Hook
- afterTrigger is also called, if result is bailed
- HookCancel is created with `Symbol.for('HookCancel')`

## 3.2.1 (2023-07-14)

#### Fix

- duplicate hooks after using new add

## 3.2.0 (2023-07-14)

#### Feature

- add new method `add` to add hooks

## 3.1.0 (2023-07-04)

#### Feature

- merge more then one hook

## 3.0.0 (2023-06-03)

#### Feature

- remove arg property in Hookpoint

## 2.3.2 (2023-06-03)

#### Fixes

- revert breaking change

## 2.3.1 (2023-06-02)

#### Features

- allow bail in beforeTrigger interceptor

## 2.3.0 (2023-06-02)

#### Features

- interceptor can trigger bail

## 2.2.1 (2023-01-20)

#### Fix

- prevent infinite loop if same interceptor is added twice

## 2.2.0 (2023-01-10)

#### Fix

- NodeJS 14 error with `||=`

## 2.1.2 (2022-09-27)

#### Fix

- removeInterceptor does really remove Interceptor (#3)

## 2.1.1 (2022-08-24)

#### Features

- jest is only dev dependency

## 2.1.0 (2022-08-20)

#### Features

- ensure unique id

## 2.0.0 (2022-08-20)

#### Breaking Change

- Interceptors support Before/After sorting, but an Id must be added to the hook interceptor to work correctly

#### Fixes

- Some Sort Issues using before/after are fixed. And UnitTests are added

## 1.3.0 (2022-04-21)

#### Features

- add `trigger` function to interceptor hook context

## 1.2.0 (2022-03-07)

#### Features

- add results to hookTriggerContext

## 1.1.1 (2022-03-07)

#### Fix

- waterfall hook allows undefined as valid return


## 1.1.0 (2022-01-24)

#### Feature

- additional description on hook (only display purposes)

## 1.0.4 (2022-01-24)

#### Fix

- items and interceptors array is accessible as readonly Array

## 1.0.3 (2021-12-25)

#### Fix

- getNextArgs replaces not result

## 1.0.2 (2021-12-23)

#### Fix

- type error in addObjHook

## 1.0.1 (2021-12-23)

#### Fix

- removed not needed files from publish release

## 1.0.0 (2021-12-23)

#### Feature

- initial release
- hookpoint extracted from httpyac
