#!/bin/bash

SITE="${1}"
DOMAIN="${2}"
GROUP="${3}"
REMOTE_HOST="${4}"
PROTO="${5}"
SEC="${6}"


if [ "${PROTO}" == "ssh" ] || [ "${GROUP}" == "bleu" ]
then
    if ! bash -c "</dev/tcp/${REMOTE_HOST}/22" >/dev/null 2>&1
	then
		ret=1
		echo "Host ${REMOTE_HOST} unreachable" >/dev/stderr
	else
		statusfile="$(/usr/bin/mktemp -p /dev/shm)"
		errfile="$(/usr/bin/mktemp -p /dev/shm)"
		xterm_errfile="$(/usr/bin/mktemp -p /dev/shm)"
		xterm -T "Connecting to ${USER}@${SITE}/${DOMAIN}/${GROUP}/${REMOTE_HOST}"  -e "ssh ${REMOTE_HOST} 2>\"${errfile}\"; echo \$? > \"${statusfile}\"" 2> "${xterm_errfile}"
		ret=$?
		if [ "${ret}" == "0" ]
		then
		    ret="$(cat "${statusfile}")"
			cat "${errfile}" >/dev/stderr
		else
			cat "${xterm_errfile}" > /dev/stderr
		fi
		/bin/rm "${statusfile}" "${errfile}" "${xterm_errfile}"
	fi
	exit ${ret}
fi

some_alea=$(( RANDOM % 3 ))

cat - <<EOF_REMOTE

# Here we check the stderr message cacthing from dashboard service.
[ "${some_alea}" != "0" ] \
	&& printf -- "This is an error mascarade for testing purpose (${some_alea})" >/dev/stderr


# Here we check the exit status
# if status is not 0, a modal box must appears on the gui showing
# - this status value
# - the stdout meg
# - the above stderr msg
exit ${some_alea}

