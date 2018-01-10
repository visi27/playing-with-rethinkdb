#!/bin/bash
rethinkdb proxy --join ${JOINNODE}:29015 --bind all
