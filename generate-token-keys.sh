# Constants
CERTS_FOLDER="certs"
ENV_FILE=".env"

# Get enviroment variable
echo "Getting environment variable: JWT_PASSPHRASE"
if [ "$1" == "local" ];
then
  if ! [ -f "$ENV_FILE" ]
  then
    echo "Before continuing, add the ${ENV_FILE} file."
    exit 1
  fi
  source ./.env
fi

# Verify is empty
if ! [ -n "$JWT_PASSPHRASE" ]
then
  echo "Before continuing, add a value to the JWT_PASSPHRASE environment variable."
  exit 1
fi

# Generate keys
echo "Generating public and private keys"
openssl genrsa -aes128 -passout pass:$JWT_PASSPHRASE -out private.key 512
openssl rsa -in private.key -passin pass:$JWT_PASSPHRASE -pubout -out public.key

# Move keys
echo "Moving files to the certs folder"
if ! [ -d "$CERTS_FOLDER" ]
then
  mkdir $CERTS_FOLDER
fi
mv "private.key" $CERTS_FOLDER
mv "public.key" $CERTS_FOLDER