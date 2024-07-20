const fs = require('fs').promises;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() 
{
  const data = JSON.parse(await fs.readFile('../data/people.json', 'utf-8'));

  for (const student of data) 
  {
    await prisma.student.create
    ({
      data: 
      {
        name: student.name,
        studentId: student.student_id,
        telegramChatId: student.telegram_chat_id
      }
    });
  }
}

main()
.catch((e) => 
{
  console.error(e);
  process.exit(1);
})
.finally(async () => 
{
  await prisma.$disconnect();
});
