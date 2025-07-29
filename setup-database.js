const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const SUPABASE_URL = 'https://csknokadqcubncivhxjp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNza25va2FkcWN1Ym5jaXZoeGpwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0ODIxNywiZXhwIjoyMDY5MjI0MjE3fQ.0A3hwiNKm5obCqO1VmAeBnsA_AU1UW6A4vqvUlW_tFg';

async function executeSQLScript(scriptName, sqlContent) {
  try {
    console.log(`🔄 Executando: ${scriptName}`);
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        sql: sqlContent
      })
    });

    if (response.ok) {
      console.log(`✅ ${scriptName} executado com sucesso!`);
    } else {
      const error = await response.text();
      console.log(`⚠️ ${scriptName} - Aviso: ${error}`);
    }
  } catch (error) {
    console.log(`❌ Erro ao executar ${scriptName}: ${error.message}`);
  }
}

async function setupDatabase() {
  console.log('🚀 INICIANDO CONFIGURAÇÃO DO BANCO DE DADOS SUPABASE...\n');

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

  for (const scriptFile of scriptFiles) {
    const scriptPath = path.join(scriptsDir, scriptFile);
    
    if (fs.existsSync(scriptPath)) {
      const sqlContent = fs.readFileSync(scriptPath, 'utf8');
      await executeSQLScript(scriptFile, sqlContent);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`❌ Arquivo não encontrado: ${scriptFile}`);
    }
  }

  console.log('\n🎉 CONFIGURAÇÃO DO BANCO DE DADOS CONCLUÍDA!');
}

setupDatabase().catch(console.error);
