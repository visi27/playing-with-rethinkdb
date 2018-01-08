FROM rethinkdb:latest

COPY ./start-rethinkdb-cluster.sh /tmp

RUN chmod 777 /tmp/start-rethinkdb-cluster.sh
RUN ls -al /data

CMD ["bash", "-c", "rethinkdb proxy --join rethinkdb1:29015 --bind all"]
