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

This is a mock script for testing purpose.

   Make your own script. The remote connection can be different
   depending on SITE, DOMAIN and GROUP parameters.

Parameters are:

   1:        SITE = ${SITE}
   2:      DOMAIN = ${DOMAIN}
   3:       GROUP = ${GROUP}
   4: REMOTE_HOST = ${REMOTE_HOST}
   5:       PROTO = ${PROTO}
   6:         SEC = ${SEC}


It generates a random value in (0..3).

  Current value is : ${some_alea}

If the value is greater then 0, a sleep sequence is set
to test the button's spinner on gui.

The value is used as script return status to test gui popup


EOF_REMOTE


if [ "${some_alea}" != "0" ]
then
   printf -- "    Sleeping ${some_alea} sec \n"
   # This sleep cmd is used to check te button spinner on the gui
   sleep ${some_alea}
   # Here we check the stderr message cacthing from dashboard service.
	printf -- "This is an error mascarade for testing purpose withc return's value (${some_alea})" >/dev/stderr
fi


# Here we check the exit status
cat <<EOF_FOOT

if status is not 0, a modal box must appears on the gui showing
- this status value (${some_alea})
- the stdout meg
- the above stderr msg

EOF_FOOT

exit ${some_alea}

