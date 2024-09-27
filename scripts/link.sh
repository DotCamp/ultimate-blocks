#!/bin/bash

if [ $# -gt 1 ] ; then
    echo "Too many arguments provided"
    echo "USAGE: npm run link <path_to_wp_dir>"
    exit
fi

if [ $# -eq 0 ] ; then
    printf "Enter path to wordpress installation: "
    read path
else
    path="$1"
fi

if [ ! -d "$path" ]; then
    echo "$path does not exist."
    exit
fi

if [ -d "packages/ultimate-blocks" ]; then
    base_package_dir="packages/ultimate-blocks"
else
    printf "Enter path to base package: "
    read base_package_dir
fi

if [ -d "packages/pro" ]; then
    pro_package_dir="packages/pro"
else
    printf "Enter path to pro package: "
    read pro_package_dir
fi

path=$(readlink -f "$path")
ln -sfn $(readlink -f "$base_package_dir") "$path/wp-content/plugins/ultimate-blocks"
ln -sfn $(readlink -f "$pro_package_dir") "$path/wp-content/plugins/ultimate-blocks-pro"

