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
