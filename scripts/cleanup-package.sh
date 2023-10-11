#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 <package-name>"
  exit 1
fi

package_name="$1"

# Fetch package information from the npm registry
package_info=$(curl -s "https://registry.npmjs.org/$package_name")

# Extract the latest version
latest_version=$(echo "$package_info" | jq -r '.["dist-tags"].latest')

if [ -n "$latest_version" ]; then
  echo "Latest version: $latest_version"
  
  # Loop through all versions and delete them (except the latest one)
  versions=$(echo "$package_info" | jq -r '.versions | keys[]')
  for version in $versions; do
    if [ "$version" != "$latest_version" ]; then
      echo "Deleting version $version"
    #   npm unpublish "$package_name@$version" --force
      npm deprecate -f "$package_name@$version this package has been deprecated"
    fi
  done

  echo "Finished cleaning up versions."
else
  echo "Failed to fetch package information from the npm registry."
fi
