-- Atualiza o formato das datas existentes
UPDATE Progress 
SET date = strftime('%d/%m/%Y %H:%M:%S', datetime(substr(date, 1, 19))); 