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
        where: { id: id }
    });

    return user;
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

module.exports = { checkCredentials, insertData, checkLoginId, setToken, resetPassword, checkToken};