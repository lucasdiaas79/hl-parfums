-- 0003: correção de gênero (Fragrantica), 70 -> Unissex, 1 -> Feminino
update public.products set gender='Unissex',
  description=regexp_replace(description,'\m(masculin|feminin)[oa]\M','unissex','gi')
where ref in ('010','019','020','022','025','029','030','037','040','041','048','143','056','061','067','070','077','080','108','109','114','116','122','135','152','060','063','065','069','120','072','100','101','102','103','104','105','106','107','074','079','083','086','090','091','092','093','094','095','096','097','098','099','118','139','124','126','127','130','131','132','134','138','142','144','145','147','148','149','151');
update public.products set gender='Feminino',
  description=regexp_replace(regexp_replace(description,'\mmasculino\M','feminino','g'),'\mmasculina\M','feminina','g')
where ref='076';
select gender, count(*) from public.products group by gender order by gender;
