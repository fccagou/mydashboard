#!/bin/sh

SITE="${1}"
DOMAIN="${2}"
GROUP="${3}"
REMOTE_HOST="${4}"

cat - <<EOF_REMOTE
Accessing to ${SITE}/${DOMAIN}/${GROUP}/${REMOTE_HOST}

This is a sample script for test purpose.
Make your own script. The remote connection can be different
depending on SITE, DOMAIN and GROUP parameters.

EOF_REMOTE

some_alea=$(( RANDOM % 3 ))

# This sleep cmd is used to check te button spinner on the gui
sleep ${some_alea}

# Here we check the stderr message cacthing from dashboard service.
[ "${some_alea}" != "0" ] \
	&& printf -- "This is an error mascarade for testing purpose (${some_alea})" >/dev/stderr


# Here we check the exit status
# if status is not 0, a modal box must appears on the gui showing
# - this status value
# - the stdout meg
# - the above stderr msg
exit ${some_alea}

