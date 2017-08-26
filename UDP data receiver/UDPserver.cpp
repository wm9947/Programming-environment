

/*
 Simple udp server
 reference : http://www.binarytides.com/programming-udp-sockets-c-linux/
 */
#include<stdio.h>
#include<string.h> 
#include<stdlib.h>
#include<arpa/inet.h>
#include<unistd.h>
#include<sys/socket.h>

#define BUFLEN 512  //Max length of buffer
#define PORT 7000   //The port on which to listen for incoming data

void publishKinbaControl(char data);
void error(char *s);

int main(void)
{
    struct sockaddr_in si_me, si_other;
    
    int s, i, slen = sizeof(si_other) , recv_len;
    char buf[BUFLEN];
    
    //create a UDP socket
    if ((s=socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)) == -1)
    {
        error("socket");
    }
    
    // zero out the structure
    memset((char *) &si_me, 0, sizeof(si_me));
    
    si_me.sin_family = AF_INET;
    si_me.sin_port = htons(PORT);
    si_me.sin_addr.s_addr = htonl(INADDR_ANY);
    
    //bind socket to port
    if( bind(s , (struct sockaddr*)&si_me, sizeof(si_me) ) == -1)
    {
        error("bind");
    }
    
    //keep listening for data
    while(1)
    {
        fflush(stdout);
        memset(buf, '\0', BUFLEN);
        
        //try to receive some data, this is a blocking call
        if ((recv_len = recvfrom(s, buf, BUFLEN, 0, (struct sockaddr *) &si_other, (socklen_t*)&slen)) == -1)
        {
            error("recvfrom()");
        }
        
        //print details of the client/peer and the data received
        printf("Received packet from %s:%d\n", inet_ntoa(si_other.sin_addr), ntohs(si_other.sin_port));
        printf("Data: %s\n" , buf);
        
        publishKinbaControl(buf[0]);
        //now reply the client with the same data
        if (sendto(s, buf, recv_len, 0, (struct sockaddr*) &si_other, slen) == -1)
        {
            error("sendto()");
        }
    }
    
    close(s);
    return 0;
}

void error(char *s)
{
    perror(s);
    exit(1);
}
void publishKinbaControl(char data)
{
    int option = 0;
    switch (data) {
        case 'A':
            option = 1;
            break;
        case 'B':
            option = 2;
            break;
        case 'C':
            option = 3;
            break;
        default:
            break;
    }
    //add a function to publish data to the ROS
    //publish(option);
}


