/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
export function all_succeeded(checks) {
    return get_checks(checks).every(check => check.status === "succeeded");
}
export function get_checks(checks) {
    return Object.values(checks);
}
