export default {
  filename: ".oxfmtrc.json",
  template: `{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "ignorePatterns": [<% if (antiSlop) { %>"tools/oxlint/anti-slop/"<% } %>]
}`,
};
