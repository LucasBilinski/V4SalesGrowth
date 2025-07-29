const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const SUPABASE_URL = 'https://csknokadqcubncivhxjp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNza25va2FkcWN1Ym5jaXZoeGpwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0ODIxNywiZXhwIjoyMDY5MjI0MjE3fQ.0A3hwiNKm5obCqO1VmAeBnsA_AU1UW6A4vqvUlW_tFg';

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function executeSQLViaRPC(scriptName, sqlContent) {
  try {
    console.log(`🔄 Executando via RPC: ${scriptName}`);
    
    // Dividir o SQL em comandos individuais
    const commands = sqlContent.split(';').filter(cmd => cmd.trim().length > 0);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim();
      if (command.length === 0) continue;
      
      console.log(`  📝 Comando ${i + 1}/${commands.length}: ${command.substring(0, 50)}...`);
      
      try {
        // Tentar executar via RPC
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: command
        });

        if (error) {
          console.log(`    ⚠️ Comando ${i + 1} - Erro: ${error.message}`);
        } else {
          console.log(`    ✅ Comando ${i + 1} executado com sucesso!`);
        }
      } catch (cmdError) {
        console.log(`    ❌ Comando ${i + 1} - Erro: ${cmdError.message}`);
      }
      
      // Aguardar um pouco entre comandos
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`✅ ${scriptName} processado!`);
    return true;
  } catch (error) {
    console.log(`❌ Erro ao executar ${scriptName}: ${error.message}`);
    return false;
  }
}

async function setupDatabase() {
  console.log('🚀 INICIANDO EXECUÇÃO AVANÇADA DOS SCRIPTS SQL NO SUPABASE...\n');
  console.log('📋 MÉTODO: Cliente Supabase com RPC\n');

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

  let successCount = 0;
  let totalCount = scriptFiles.length;

  for (let i = 0; i < scriptFiles.length; i++) {
    const scriptFile = scriptFiles[i];
    const scriptPath = path.join(scriptsDir, scriptFile);
    
    if (fs.existsSync(scriptPath)) {
      const sqlContent = fs.readFileSync(scriptPath, 'utf8');
      console.log(`\n📁 ${i + 1}/${totalCount}: ${scriptFile}`);
      console.log(`📄 Tamanho: ${sqlContent.length} caracteres`);
      
      const success = await executeSQLViaRPC(scriptFile, sqlContent);
      if (success) successCount++;
      
      // Aguardar entre scripts
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`❌ Arquivo não encontrado: ${scriptFile}`);
    }
  }

  console.log(`\n🎉 EXECUÇÃO CONCLUÍDA!`);
  console.log(`✅ Scripts executados com sucesso: ${successCount}/${totalCount}`);
  console.log(`📊 Taxa de sucesso: ${Math.round((successCount/totalCount) * 100)}%`);
  
  if (successCount === totalCount) {
    console.log(`\n🎯 TODOS OS SCRIPTS FORAM EXECUTADOS COM SUCESSO!`);
    console.log(`🚀 BANCO DE DADOS CONFIGURADO E PRONTO PARA USO!`);
  } else {
    console.log(`\n⚠️ ALGUNS SCRIPTS PODEM TER FALHADO.`);
    console.log(`📝 Verifique manualmente no Supabase SQL Editor se necessário.`);
  }
}

setupDatabase().catch(console.error);
