# audit-check

### Badges  
[![Build Status](https://circleci.com/gh/lee5i3/audit-check.svg?style=shield)](https://circleci.com/gh/lee5i3/audit-check)
[![codecov](https://codecov.io/gh/lee5i3/audit-check/branch/master/graph/badge.svg)](https://codecov.io/gh/lee5i3/audit-check)
[![Known Vulnerabilities](https://snyk.io/test/github/lee5i3/audit-check/badge.svg)](https://snyk.io/test/github/lee5i3/audit-check)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=lee5i3_audit-check&metric=alert_status)](https://sonarcloud.io/dashboard?id=lee5i3_audit-check)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f91b80021c6d4f0cb4f1dda56f580273)](https://www.codacy.com/manual/lee5i3/audit-check?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=lee5i3/audit-check&amp;utm_campaign=Badge_Grade)

### Install
```
npm install -g audit-check
```

### Common Configuration Options
| Options | Description  | Type | Default  |
|---|---|---|---|
| ```severity``` | Severity to ignore, will filter from the result and return the correct exit code | ```String```  | ```info```  |
| ```json``` | Weither to return a JSON or Table | ```Boolean```  | ```false```  |
| ```ignore-dev``` | Weither to ignore dev-dependencies  | ```Boolean```  | ```false``` |
| ```output``` | Path to save output to  | ```String```  |  |
| ```whitelist``` | List of module names to ignore, comma-separated | ```String``` | |

### Examples

Outputs a JSON but excluding debug
```
audit-check --json --whitelist debug
```

Outputs a JSON but only showing high or greater severity
```
audit-check --severity high --json
```

Outputs a json to file with only low and higher severity, excludes debug and only from production dependencies
```
audit-check --severity low --whitelist debug --ignore-dev --output ./result.json
```

Outputs a table with only low and higher severity, excludes debug and only from production dependencies
```
audit-check --severity low --whitelist debug --ignore-dev
```