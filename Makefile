createdb:
	psql -f ./db/create_database.sql

add_seed_data:
	psql -f ./db/add_seed_data.sql

create_db_and_add_seed_data: createdb add_seed_data
