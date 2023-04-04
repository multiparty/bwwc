#!/bin/bash

# Generate JSON file
echo "Generating data.json file"
cat > /usr/share/nginx/html/data.json <<EOF
{
EOF

# Loop through environment variables starting with VITE_
while IFS='=' read -r key value; do
  if [[ "$key" == VITE_* ]]; then
    name=$(echo "$key")
    echo "  \"$name\": \"$value\"," >> /usr/share/nginx/html/data.json
    echo "Adding $name to data.json"
  fi
done < <(env)

# Complete JSON file
echo "Adding timestamp to data.json"
cat >> /usr/share/nginx/html/data.json <<EOF
  "timestamp": $(date +%s)
}
EOF
echo "Done generating data.json file"
