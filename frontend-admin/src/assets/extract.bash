#!/bin/bash

# Input and output file names
input_file="worldcities.csv"
output_file="swedish_cities.csv"

grep '"Sweden",' "$input_file" > "$output_file"
