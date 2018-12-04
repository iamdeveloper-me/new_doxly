
namespace :users do
  task :import_all, [:path] => :environment do |t, args|
    users_array = [
      ["Aaron","Anthony","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2484","Anthony.Aaron@icemiller.com"],
      ["Banister","James","Associate","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-5812","James.Banister@icemiller.com"],
      ["Barnhart","Richard","Partner","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-2246","Richard.Barnhart@icemiller.com"],
      ["Braum","Edward","Partner","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-1098","Edward.Braum@icemiller.com"],
      ["Brier","Elizabeth","Associate","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2261","Elizabeth.Brier@icemiller.com"],
      ["Camron","Kristine","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-5948","Kristine.Camron@icemiller.com"],
      ["Capen","Tim","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2425","Tim.Capen@icemiller.com"],
      ["Christie","Joshua","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-5802","Joshua.Christie@icemiller.com"],
      ["Clarke","Marita","Practice Group BD Specialist","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-5847","Marita.Clarke@icemiller.com"],
      ["Cochran","Robert","Partner","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-2248","Robert.Cochran@icemiller.com"],
      ["Dawley","Kris","Partner","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-2290","Kris.Dawley@icemiller.com"],
      ["Dingledy","Jay","Partner","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-2214","Jay.Dingledy@icemiller.com"],
      ["DuBois","Dustin","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2251","Dustin.DuBois@icemiller.com"],
      ["Edwards","Stephen","Associate","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-1108","Stephen.Edwards@icemiller.com"],
      ["Emmert","Margaret","Of Counsel","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2169","Margaret.Emmert@icemiller.com"],
      ["Fabina-Abney","Sherry","Partner","Ice Miller LLP","One American Square","Suite 3100","Indianapolis","IN","46282-0200","(317) 236-2446","Sherry.Fabina-Abney@icemiller.com"],
      ["Farrell","Michael","Associate","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-1044","Michael.Farrell@icemiller.com"],
      ["Gonso","Harry","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2325","harry.gonso@icemiller.com"],
      ["Goodman","Eric","Associate","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-5804","Eric.Goodman@icemiller.com"],
      ["Groff","Jonathan","Associate","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-5803","Jon.Groff@icemiller.com"],
      ["Hackman","Stephen","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2289","Stephen.Hackman@icemiller.com"],
      ["Hight","David","Partner","Ice Miller LLP","2300 Cabot Drive","Suite 455","Lisle","IL","60532","(630) 955-5821","David.Hight@icemiller.com"],
      ["Humke","Steven","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2394","Steven.Humke@icemiller.com"],
      ["Hunter","Trudy","Paralegal","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2365","Trudy.Hunter@icemiller.com"],
      ["Jordan","Michael","Partner","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-2283","Michael.Jordan@icemiller.com"],
      ["Keglewitsch","Josef","Partner","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-2279","Josef.Keglewitsch@icemiller.com"],
      ["Leffelman","Dean","Partner","Ice Miller LLP","2300 Cabot Drive","Suite 455","Lisle","IL","60532","(630) 955-6390","Dean.Leffelman@icemiller.com"],
      ["McCloud","Dennis","Legal Secretary","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2136","Dennis.McCloud@icemiller.com"],
      ["Michael","Chris","Associate","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-1148","Chris.Michael@icemiller.com"],
      ["Millikan","Michael","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-5965","Michael.Millikan@icemiller.com"],
      ["Ouellette","Robert","Partner","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-2242","Ouellette@icemiller.com"],
      ["Pampush","Thomas","Partner","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-5041","Thomas.Pampush@icemiller.com"],
      ["Pemberton","Gregory","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2313","Gregory.Pemberton@icemiller.com"],
      ["Robinett","John","Partner","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-2218","John.Robinett@icemiller.com"],
      ["Samblanet","Lisa","Paralegal","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-1045","Lisa.Samblanet@icemiller.com"],
      ["Schnellenberger","Thomas","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-5886","thomas.schnellenberger@icemiller.com"],
      ["Selby","Myra","Partner","Ice Miller LLP","One American Square"," Suite 3100","Indianapolis","IN","46282-0200","(317) 236-5903","Myra.Selby@icemiller.com"],
      ["Servies","Matthew","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-5849","Matt.Servies@icemiller.com"],
      ["Sharp","Brittney","Of Counsel","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2316","Brittney.Sharp@icemiller.com"],
      ["Showalter","Brent","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2469","Brent.Showalter@icemiller.com"],
      ["Snively","Scott","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2375","Scott.Snively@icemiller.com"],
      ["Stackhouse","Dale","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2401","Dale.Stackhouse@icemiller.com"],
      ["Stone","Taryn","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-5872","Taryn.Stone@icemiller.com"],
      ["Thornburgh","John","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0200","(317) 236-2405","John.Thornburgh@icemiller.com"],
      ["Thrapp","Richard","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","Indiana","46282","(317) 236-2442","Richard.Thrapp@icemiller.com"],
      ["Tridico","Kristina","Partner","Ice Miller LLP","One American Square","Suite 2900","Indianapolis","IN","46282-0002","(317) 236-2266","Kristina.Tridico@icemiller.com"],
      ["Waite","Nancy","Of Counsel","Ice Miller LLP","Arena District","250 West Street Suite 700","Columbus","OH","43215","(614) 462-5015","nancy.waite@icemiller.com"],
      ["Woodhouse","Kevin","Partner","Ice Miller LLP","12120 Thicket Hill Circle","","Carmel","IN","46033","(317) 236-2154","Kevin.Woodhouse@icemiller.com"]
    ]

    entity = Entity.find_by :name => "Ice Miller LLP"

    users_array.each do |user_array|
      puts "importing #{user_array[10].downcase}"
      user = User.new(
                      :first_name => user_array[1],
                      :last_name => user_array[0],
                      :address => "#{user_array[4]}, #{user_array[5]}",
                      :city => user_array[6],
                      :state => user_array[7],
                      :zip => user_array[8],
                      :phone => user_array[9],
                      :email => user_array[10].downcase,
                      :password => 'Test1234'
                      )
      user.skip_confirmation!
      user.is_active = true
      user.save!
      entity_user = entity.entity_users.new(:user_id => user.id, :is_owner => true, :modules => {:has_deals => [:admin, :user], :has_my_entity => [:admin, :user]})
      entity_user.save!
    end

  end
end
