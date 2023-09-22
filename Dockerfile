# Set base image (host OS)
FROM python:3.8-alpine

# By default, listen on port 5000
EXPOSE 5000/tcp

# Set the working directory in the container
WORKDIR /syft-hackathon

# Copy the dependencies file to the working directory
COPY requirements.txt /syft-hackathon/
COPY static /syft-hackathon/static
COPY templates /syft-hackathon/templates
COPY JCupcakeCompany.sqlite /syft-hackathon/

# Install any dependencies
RUN pip install -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY server.py /syft-hackathon/

# Specify the command to run on container start
CMD [ "python", "./server.py" ]