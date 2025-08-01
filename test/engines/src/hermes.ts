// Include Intl polyfills
import "@formatjs/intl-getcanonicallocales/polyfill";
import "@formatjs/intl-locale/polyfill";
import "@formatjs/intl-pluralrules/polyfill";
import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/en";
import "@formatjs/intl-datetimeformat/polyfill";
import "@formatjs/intl-datetimeformat/locale-data/en";
import "@formatjs/intl-datetimeformat/add-golden-tz"; // or: "@formatjs/intl-datetimeformat/add-all-tz"
// Tests
import "./test.ts";
