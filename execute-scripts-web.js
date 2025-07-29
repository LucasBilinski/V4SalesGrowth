const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function openSupabaseSQL() {
  console.log('🚀 ABRINDO SUPABASE SQL EDITOR NO NAVEGADOR...\n');
  
  const url = 'https://supabase.com/dashboard/project/csknokadqcubncivhxjp/sql';
  
  // Abrir o navegador
  exec(`open "${url}"`, (error) => {
    if (error) {
      console.log('❌ Erro ao abrir navegador:', error.message);
      console.log(`📋 Acesse manualmente: ${url}`);
    } else {
      console.log('✅ Navegador aberto com o Supabase SQL Editor!');
    }
  });
  
  console.log('📋 INSTRUÇÕES PARA EXECUÇÃO MANUAL:\n');
  console.log('1. O navegador foi aberto com o Supabase SQL Editor');
  console.log('2. Execute os scripts na seguinte ordem:\n');
  
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

  for (let i = 0; i < scriptFiles.length; i++) {
    const scriptFile = scriptFiles[i];
    const scriptPath = path.join(scriptsDir, scriptFile);
    
    if (fs.existsSync(scriptPath)) {
      const sqlContent = fs.readFileSync(scriptPath, 'utf8');
      console.log(`${i + 1}. 📁 ${scriptFile}`);
      console.log(`   📄 Tamanho: ${sqlContent.length} caracteres`);
      console.log(`   📝 Copie e cole o conteúdo abaixo no SQL Editor:`);
      console.log(`   ${'='.repeat(50)}`);
      console.log(sqlContent);
      console.log(`${'='.repeat(50)}`);
      console.log(`   ✅ Execute e aguarde a confirmação antes do próximo script\n`);
    } else {
      console.log(`❌ Arquivo não encontrado: ${scriptFile}`);
    }
  }

  console.log('🎯 EXECUTE OS SCRIPTS NA ORDEM ACIMA!');
  console.log('🚀 APÓS EXECUTAR TODOS, O BANCO ESTARÁ CONFIGURADO!');
}

openSupabaseSQL().catch(console.error);
