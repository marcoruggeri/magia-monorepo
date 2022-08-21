#! /usr/bin/env bash
re='^[0-9]+$'

sprites_json() {
  echo "{" > "$1.json"
  for f in *.png; do
    # o=$(echo $f | cut -d"-" -f1)
    o=$(echo $f | cut -c1-3)

    if ! [[ "$o" =~ $re ]] ; then
      # not a number
      continue
    fi

    echo "  \"$o\" : \"$f\"," >> "$1.json"
  done
  
  echo "}" >> "$1.json"

  # remove the last ,
  line=$(tail -n2 "$1.json" | head -n1)
  clean_line=$(echo $line | sed 's/,//')
  sed -i "s/$line/$clean_line/" "$1.json"
}

known=("lands units pennants shield spells")

if [[ " ${known[*]} " =~ " ${1} " ]]; then
  cd "public/assets/sprites/$1"; 
  montage [0-9]*.png  -tile x4  -geometry 128x128 -background None "magia-$1.png"; 
  cp "magia-$1.png" ../../../tiles/
  sprites_json $1
else
  echo "Unknown cmd. Try: ${known}"
fi
