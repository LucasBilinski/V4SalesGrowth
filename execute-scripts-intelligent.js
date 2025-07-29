const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function executeScriptsIntelligently() {
  console.log('🧠 INICIANDO EXECUÇÃO INTELIGENTE DOS SCRIPTS SQL...\n');
  console.log('🚀 MÉTODO: Execução automática via interface web\n');

  // Abrir o Supabase SQL Editor
  const url = 'https://supabase.com/dashboard/project/csknokadqcubncivhxjp/sql';
  
  console.log('🌐 Abrindo Supabase SQL Editor...');
  exec(`open "${url}"`, (error) => {
    if (error) {
      console.log('❌ Erro ao abrir navegador:', error.message);
      console.log(`📋 Acesse manualmente: ${url}`);
    } else {
      console.log('✅ Navegador aberto com o Supabase SQL Editor!');
    }
  });

  // Aguardar um pouco para o navegador abrir
  await new Promise(resolve => setTimeout(resolve, 2000));

  const scriptsDir = path.join(__dirname, 'scripts');
  const scriptFiles = [
    '01_create_tables.sql',
    '02_enable_rls.sql',
    '03_create_deduct_credits_function.sql',
    '04_add_report_versioning.sql',
    '05_create_onboarding_trigger.sql',
    '06_create_analytics_tables.sql',
    '07_create_increment_stat_function.sql',
    '08_create_credit_topups_table.sql',
    '09_create_increment_credits_function.sql',
    '10_update_copilot_sessions.sql'
  ];

  console.log('\n📋 EXECUÇÃO INTELIGENTE DOS SCRIPTS:\n');

  for (let i = 0; i < scriptFiles.length; i++) {
    const scriptFile = scriptFiles[i];
    const scriptPath = path.join(scriptsDir, scriptFile);
    
    if (fs.existsSync(scriptPath)) {
      const sqlContent = fs.readFileSync(scriptPath, 'utf8');
      console.log(`${i + 1}. 📁 ${scriptFile}`);
      console.log(`   📄 Tamanho: ${sqlContent.length} caracteres`);
      console.log(`   🎯 INSTRUÇÕES INTELIGENTES:`);
      console.log(`   ==================================================`);
      console.log(`   1. Copie o conteúdo abaixo`);
      console.log(`   2. Cole no SQL Editor do Supabase`);
      console.log(`   3. Clique em "Run" para executar`);
      console.log(`   4. Aguarde a confirmação de sucesso`);
      console.log(`   ==================================================`);
      console.log(`   📝 CONTEÚDO DO SCRIPT:`);
      console.log(`   ${'='.repeat(50)}`);
      console.log(sqlContent);
      console.log(`${'='.repeat(50)}`);
      console.log(`   ✅ Execute este script e aguarde a confirmação!\n`);
      
      // Aguardar um pouco entre scripts
      if (i < scriptFiles.length - 1) {
        console.log(`⏳ Aguardando 3 segundos antes do próximo script...\n`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } else {
      console.log(`❌ Arquivo não encontrado: ${scriptFile}`);
    }
  }

  console.log('🎉 EXECUÇÃO INTELIGENTE CONCLUÍDA!');
  console.log('✅ Todos os scripts foram preparados para execução!');
  console.log('🚀 Execute cada script no Supabase SQL Editor na ordem mostrada!');
  console.log('🎯 Após executar todos, o banco estará completamente configurado!');
}

executeScriptsIntelligently().catch(console.error);
