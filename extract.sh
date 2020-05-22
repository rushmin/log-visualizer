if [ $# -eq 0 ]
  then
    printf "$(tput bold)\nUsage : extract.sh <log_file> <pattern_to_extract_timestamp_and_latency> <regex_group_number_for_timestamp> <regex_group_number_for_latency>$(tput sgr0)\n"
    printf "\n$(tput bold)Sample$(tput sgr0)\n\n"
    printf "$(tput bold)Log Pattern$(tput sgr0) : 127.0.0.1 - - [20/May/2020:15:45:42 +0000] \"POST /services/APIKeyValidationService HTTP/1.1\" 200 4297 \"-\" \"Axis2\" time:20\n"
    printf "$(tput bold)Regex$(tput sgr0) : .*\[\(.*\) +0000\].*time:\(.*\)\n"
    printf "$(tput bold)Command$(tput sgr0) : ./extract.sh http_access.log \".*\[$(tput bold)\(.*\)$(tput sgr0) +0000\].*time:$(tput bold)\(.*\)$(tput sgr0)\" 1 2\n\n"
    exit 1
fi

echo "var latencies = [" > latencies.js
cat $1 | sed "s/$2/{\\\"timestamp\":\"\\$3\",\"latency\":\\$4},/" >> latencies.js
echo "]" >> latencies.js
