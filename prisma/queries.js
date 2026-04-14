const { PrismaClient } = require('@prisma/client');
const { PrismaPg } =require('@prisma/adapter-pg') ;
const adapter=new PrismaPg({
    connectionString: process.env.DATABASE_URL
});
const prisma = new PrismaClient({adapter});


async function checkCredentials(email) {
    const user = await prisma.usersCredentials.findUnique({
        where: { email:email }
    });
    return user;
};

async function insertData(name, lastName, date, email, password){
    await prisma.users.create({
        data:{
            name: name,
            lastName:lastName,
            birthDate: date,

            credentials:{
                create:{
                    email:email,
                    password:password
                }
            }
        }
    })
}

async function checkLoginId(id){
    const user = await prisma.usersCredentials.findUnique({
        where: { id: id },
        include: {
            user: { 
                select: {
                    avatarUrl: true,
                    name: true,
                    lastName: true,
                    following: {
                        select: {
                            following: {
                                select: {
                                    id: true,
                                    name: true,
                                    lastName: true,
                                    avatarUrl: true
                                }
                            }
                        }
                    }
                } 
            },
        },
    });

    if (!user) return null;

    return {
        ...user,
        user: {
            ...user.user,
            following: user.user.following.map(f => f.following)
        }
    };
}

async function setToken(email, hashedToken){
    const date=new Date();
    date.setTime(date.getTime()+ 60*60*1000);

    await prisma.usersCredentials.update({
        where: {email},
        data:{
            resetToken:hashedToken,
            tokenExpiry: date
        }
    })
}

async function resetPassword(hashedToken, hashedPassword){
    await prisma.usersCredentials.update({
        where: {resetToken: hashedToken},
        data:{
            resetToken:'',
            tokenExpiry: null,
            password: hashedPassword
        }
    })
}

async function checkToken(token){
    const user = await prisma.usersCredentials.findUnique({
        where: { resetToken: token }
    });
    
    return user;
}

async function checkFindUser(value) {
  const users = await prisma.users.findMany({
    where: {
      OR: [
        { name: { startsWith: value, mode: 'insensitive' } },
        { lastName: { startsWith: value, mode: 'insensitive' } }
      ],
    },
    include: {
      followers: { select: { followerId: true } }
    },
    orderBy: {
      followers: {
        _count: 'desc'
      }
    }
  });

  return users;
}

async function uploadFile(url, userId){
    await prisma.users.update({
        where: {id: userId},
        data:{
            avatarUrl: url
        }
    })
}

async function findUserData(id){
    const user = await prisma.users.findUnique({
        where: { id: id },
        include: {
            followers: {
                where: {
                    followingId: id
                },
                select: {
                    followerId: true
                }
            },
            following: {
                where: {
                    followerId: id
                },
                select: {
                    followingId: true
                }
            }
        }
    });
    return user;
}

async function followUser(follower,following){
    const user=await prisma.follow.create({
        data:{
            followerId: follower,
            followingId: following
        }
    })  

    return user;
}

async function unfollowUser(follower,following){
    await prisma.follow.delete({
        where: {
            followerId_followingId: {
                followerId: follower,
                followingId: following
            }
        }
    });
}

async function createPost(content, imageUrl, userId){
    const post = await prisma.post.create({
        data: {
            content,
            imageUrl: imageUrl || null,
            userId
        }
    });
    return post;
}

async function getPostsByUserId(userId) {
  return await prisma.post.findMany({
    where: {
      userId: userId
    },
    include: {
      user: true,
      likes: {
        include: {
          user: true
        }
      },
      comments: {
        include: {
          user: true,
          commentLikes: {
            include: {
              user: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

async function likePost(user, post) {
  return await prisma.like.create({
    data: {
      userId: user,
      postId: post
    },
    include: {
      post: {
        include: {
          user: true
        }
      }
    }
  })    
}

async function unlikePost(user, post) {
  return await prisma.like.delete({
    where: {
      userId_postId: {
        userId: user,
        postId: post
      }
    },
    include: {
      post: {
        include: {
          user: true
        }
      }
    }
  });
}

async function getPostReactions(postId){
    return await prisma.like.findMany({
        where: {
            postId: postId
        },
        include: {
            user: true
        }
    });
}

async function commentPost(userId, postId, content, parentId = null) {
  return await prisma.comment.create({
    data: {
      content,
      userId,
      postId,
      parentId
    },
    include: {
      post: {
        include: {
          user: true
        }
      }
    }
  });
}

async function getSinglePost(postId){
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            user: true,
            likes: {
                include: { user: true }
            },
            comments: {
        include: {
          user: true,
          commentLikes: {
            include: {
              user: true
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
        },
    });

    return post;
}

async function likeComment(userId, commentId) {
  return await prisma.commentLike.create({
    data: {
      userId,
      commentId
    },
    include: {
      comment: {
        include: {
          user: true
        }
      }
    }
  });
}

async function unlikeComment(userId, commentId) {
  return await prisma.commentLike.delete({
    where: {
      userId_commentId: {
        userId,
        commentId
      }
    },
    include: {
      comment: {
        include: {
          user: true
        }
      }
    }
  });
}

async function getRecentPosts(){
    return await prisma.post.findMany({
  include: {
    user: true,
    comments: {
      include: {
        user: true, 
        commentLikes: { 
          include: {
            user: true
          }
        }
      }
    },
    likes: {  
      include: {
        user: true
      }
    }
  },
  orderBy: {
    createdAt: 'desc'
  }
});
}

async function getFollowingPosts(userId){
    return await prisma.post.findMany({
        where: {
        user: {
            followers: {
            some: { followerId: userId }
            }
        }
        },
        include: {
        user: true,
        comments: {
            include: {
            user: true,
            commentLikes: { include: { user: true } }
            }
        },
        likes: { include: { user: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}

async function getMessages(loggedUser, userId) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: loggedUser } } },
        { participants: { some: { userId: userId } } },
        {
          participants: {
            every: { userId: { in: [loggedUser, userId] } }
          }
        }
      ]
    },
    include: {
      messages: {
        include: {
          sender: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  const user = await prisma.users.findUnique({ where: { id: userId } });

  if (!conversation) {
    return { messages: [], user, conversationId: null };
  }

  const messages = conversation.messages;

  return {
    messages,
    user,
    conversationId: conversation.id
  };
}

async function createMessage(loggedUser, userId, content) {
  let conversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: loggedUser } } },
        { participants: { some: { userId: userId } } },
        {
          participants: {
            every: {
              userId: { in: [loggedUser, userId] }
            }
          }
        }
      ]
    }
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: loggedUser },
            { userId: userId }
          ]
        }
      }
    });
  }

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        content,
        conversationId: conversation.id,
        senderId: loggedUser
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            lastName: true,
            avatarUrl: true
          }
        }
      }
    }),
    prisma.conversation.update({
      where: { id: conversation.id },
      data: {updatedAt: new Date()}
    })
  ]);

  const participants = await prisma.conversationParticipant.findMany({
  where: { conversationId: conversation.id },
    select: {userId: true}
  });
  
  message.participants=participants;
  
  return message;
}

async function userConversations(userId) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId }
      }
    },
    select: {
      id: true,
      updatedAt: true,
      participants: {
        include: { user: true }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  const ez=conversations.map(({ messages, ...rest }) => ({
    ...rest,
    lastMessage: messages[0] || null
  }));
  return ez
}

async function conversationRead(loggedUserId, conversationId) {
  console.log(loggedUserId, conversationId);
  
  
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: loggedUserId },
      isRead: false
    },
    data: { isRead: true }
  });

  const conversations = await prisma.conversation.findMany({
    where: {
      id: conversationId,
      participants: { some: { userId: loggedUserId } }
    },
    include: {
      participants: { include: { user: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  });

  const ez = conversations.map(({ messages, ...rest }) => ({
    ...rest,
    lastMessage: messages[0] || null
  }));

  return ez;
}

async function createNotification(userId, actorId, type, postId = null, commentId= null){
  try {
    if(userId == actorId) return
    await prisma.notification.create({
      data: {
        userId,
        actorId,
        type,
        postId,
        commentId
      }
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

async function deleteNotification(userId, actorId, type, postId = null, commentId= null){
  if(userId === actorId) return

  try {
    await prisma.notification.deleteMany({
      where: {
        userId,
        actorId,
        type,
        postId,
        commentId
      },
});
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

async function getNotifications(userId) {
  return await prisma.notification.findMany({
    where: {
      userId: userId
    },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          lastName: true,
          avatarUrl: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

module.exports = { checkCredentials, getNotifications, deleteNotification, createNotification, conversationRead, userConversations,createMessage, getMessages, getFollowingPosts, unlikeComment,getRecentPosts, likeComment,getSinglePost, commentPost, getPostReactions, unlikePost, likePost, getPostsByUserId, createPost, followUser, insertData, checkLoginId, setToken, resetPassword, checkToken, checkFindUser, uploadFile, findUserData, unfollowUser};