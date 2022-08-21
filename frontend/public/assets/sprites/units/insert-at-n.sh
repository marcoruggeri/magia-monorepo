#! /usr/bin/env bash
# creates a gap in a continuous sequence of files
# so we can easily insert new tiles into the set and still use a simple +n algo for the highlighted version


if [[ "$#" -ne 2 ]]; then
	echo "args = <number> <filename>"
	echo "where the current <number> and every higher number will be shifted +1"
	exit 1
fi

re='^[0-9]+$'
if ! [[ $1 =~ $re ]] ; then
	echo "arg1 should be a number"
	exit 1
fi

if [[ ! -f "$2" ]]; then
  echo "arg2 should be a file"
	exit 1
fi

for f in *.png; do
  # o - original number
	o=$(echo $f | cut -d"-" -f1)

	if ! [[ "$o" =~ $re ]] ; then
		# not a number
		continue
	fi

	# n - base 10 o
	n=$((10#$o)) 

	if [[ "$n" -eq "$1" ]] || [[ "$n" -gt "$1" ]]; then
		# m - incremented number
		m=$((n+1))
		m=$(printf "%03d" $m)

		new_file=$(echo $f | sed "s/${o}/${m}/g")
		mv -- "$f" "$new_file"
	fi
 done


i=$(printf "%03d" $1)
mv -- "$2" "$i-$2"

