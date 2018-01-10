FROM rethinkdb:latest

COPY ./start-rethinkdb-cluster.sh /tmp

RUN chmod 777 /tmp/start-rethinkdb-cluster.sh
RUN ls -al /data

CMD ["bash", "-c", "/tmp/start-rethinkdb-cluster.sh"]
