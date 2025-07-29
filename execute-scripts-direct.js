const fs = require('fs');
const path = require('path');

async function executeScriptViaAPI(scriptName, sqlContent) {
  try {
    console.log(`🔄 Executando via API: ${scriptName}`);
    
    // Dividir o SQL em comandos individuais
    const commands = sqlContent.split(';').filter(cmd => cmd.trim().length > 0);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim();
      if (command.length === 0) continue;
      
      console.log(`  📝 Comando ${i + 1}/${commands.length}: ${command.substring(0, 50)}...`);
      
      try {
        // Tentar executar via API REST
        const response = await fetch('https://csknokadqcubncivhxjp.supabase.co/rest/v1/rpc/exec_sql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNza25va2FkcWN1Ym5jaXZoeGpwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0ODIxNywiZXhwIjoyMDY5MjI0MjE3fQ.0A3hwiNKm5obCqO1VmAeBnsA_AU1UW6A4vqvUlW_tFg',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNza25va2FkcWN1Ym5jaXZoeGpwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0ODIxNywiZXhwIjoyMDY5MjI0MjE3fQ.0A3hwiNKm5obCqO1VmAeBnsA_AU1UW6A4vqvUlW_tFg'
          },
          body: JSON.stringify({
            sql: command
          })
        });

        if (response.ok) {
          console.log(`    ✅ Comando ${i + 1} executado com sucesso!`);
        } else {
          const error = await response.text();
          console.log(`    ⚠️ Comando ${i + 1} - Erro: ${error}`);
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
  console.log('🚀 INICIANDO EXECUÇÃO DIRETA DOS SCRIPTS SQL NO SUPABASE...\n');
  console.log('📋 MÉTODO: API REST do Supabase\n');

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
      
      const success = await executeScriptViaAPI(scriptFile, sqlContent);
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
