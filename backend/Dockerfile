FROM python:3.11 as builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ENV SRC_HOME=/usr/src/app
RUN mkdir -p ${SRC_HOME}
WORKDIR ${SRC_HOME}
COPY . ${SRC_HOME}

RUN pip wheel --no-cache-dir --wheel-dir ${SRC_HOME}/wheels -r requirements.txt

FROM python:3.11

RUN addgroup --system app && adduser --system --group app

ENV HOME=/home/app
ENV APP_HOME=${HOME}/web
RUN mkdir -p ${APP_HOME}/staticfiles
WORKDIR ${APP_HOME}

COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache /wheels/*

COPY . ${APP_HOME}

RUN chown -R app:app ${APP_HOME}
USER app
