#!/bin/bash

set -e

cd ~ || exit

pip install frappe-bench

bench init frappe-bench --skip-assets --python "$(which python)"

mkdir ~/frappe-bench/sites/test_site
cp "${GITHUB_WORKSPACE}/.github/helper/consumer_db/$DB.json" ~/frappe-bench/sites/test_site/site_config.json

sudo apt update && sudo apt install mariadb-client-10.3
mysql --host 127.0.0.1 --port 3306 -u root -e "SET GLOBAL character_set_server = 'utf8mb4'";
mysql --host 127.0.0.1 --port 3306 -u root -e "SET GLOBAL collation_server = 'utf8mb4_unicode_ci'";

mysql --host 127.0.0.1 --port 3306 -u root -e "CREATE DATABASE test_frappe_consumer";
mysql --host 127.0.0.1 --port 3306 -u root -e "CREATE USER 'test_frappe_consumer'@'localhost' IDENTIFIED BY 'test_frappe_consumer'";
mysql --host 127.0.0.1 --port 3306 -u root -e "GRANT ALL PRIVILEGES ON \`test_frappe_consumer\`.* TO 'test_frappe_consumer'@'localhost'";

mysql --host 127.0.0.1 --port 3306 -u root -e "CREATE DATABASE test_frappe_producer";
mysql --host 127.0.0.1 --port 3306 -u root -e "CREATE USER 'test_frappe_producer'@'localhost' IDENTIFIED BY 'test_frappe_producer'";
mysql --host 127.0.0.1 --port 3306 -u root -e "GRANT ALL PRIVILEGES ON \`test_frappe_producer\`.* TO 'test_frappe_producer'@'localhost'";

mysql --host 127.0.0.1 --port 3306 -u root -e "UPDATE mysql.user SET Password=PASSWORD('travis') WHERE User='root'";
mysql --host 127.0.0.1 --port 3306 -u root -e "FLUSH PRIVILEGES";

cd ./frappe-bench || exit
sed -i 's/^watch:/# watch:/g' Procfile
sed -i 's/^schedule:/# schedule:/g' Procfile

bench setup requirements --node

bench get-app chat "${GITHUB_WORKSPACE}"

bench start &
bench --site test_site reinstall --yes

bench --site test_site install-app chat

bench build --app frappe
