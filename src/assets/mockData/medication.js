const medication = [
  {
    medicationId: 'med_01',
    problemId: 'pro_01',
    medicianName: [
      'Aspirin', 'Clopidogrel', 'Atorvastatin', 'Metoprolol', 'Lisinopril',
      'Warfarin', 'Diltiazem', 'Isosorbide Mononitrate', 'Losartan', 'Carvedilol',
      'Amiodarone', 'Nitroglycerin', 'Simvastatin', 'Rosuvastatin', 'Ezetimibe',
      'Digoxin', 'Hydrochlorothiazide', 'Verapamil', 'Ramipril', 'Felodipine'
    ]
  },
  {
    medicationId: 'med_02',
    problemId: 'pro_02',
    medicianName: [
      'Hydrocortisone', 'Tacrolimus', 'Methotrexate', 'Cyclosporine', 'Adapalene',
      'Isotretinoin', 'Mupirocin', 'Ketoconazole', 'Clotrimazole', 'Erythromycin Gel',
      'Salicylic Acid', 'Benzoyl Peroxide', 'Doxycycline', 'Tetracycline', 'Fluocinonide',
      'Betamethasone', 'Azelaic Acid', 'Calcipotriol', 'Fusidic Acid', 'Coal Tar'
    ]
  },
  {
    medicationId: 'med_03',
    problemId: 'pro_03',
    medicianName: [
      'Levodopa', 'Carbidopa', 'Ropinirole', 'Pramipexole', 'Selegiline',
      'Rasagiline', 'Amantadine', 'Topiramate', 'Gabapentin', 'Phenytoin',
      'Carbamazepine', 'Valproate', 'Lamotrigine', 'Clonazepam', 'Sumatriptan',
      'Propranolol', 'Botulinum Toxin', 'Riluzole', 'Memantine', 'Donepezil'
    ]
  },
  {
    medicationId: 'med_04',
    problemId: 'pro_04',
    medicianName: [
      'Amoxicillin', 'Azithromycin', 'Ibuprofen', 'Acetaminophen', 'Prednisolone',
      'Montelukast', 'Diphenhydramine', 'Cetirizine', 'Fluticasone', 'Salbutamol',
      'Mupirocin', 'Nystatin', 'Hydrocortisone', 'Dexamethasone', 'Meclizine',
      'Ondansetron', 'Ranitidine', 'Loperamide', 'Simethicone', 'Guaifenesin'
    ]
  },
  {
    medicationId: 'med_05',
    problemId: 'pro_05',
    medicianName: [
      'Omeprazole', 'Lansoprazole', 'Esomeprazole', 'Ranitidine', 'Famotidine',
      'Metoclopramide', 'Domperidone', 'Loperamide', 'Simethicone', 'Mesalamine',
      'Sulfasalazine', 'Prednisolone', 'Infliximab', 'Adalimumab', 'Ursodeoxycholic Acid',
      'Pancrelipase', 'Cholestyramine', 'Octreotide', 'Probiotics', 'Rifaximin'
    ]
  },
  {
    medicationId: 'med_16',
    problemId: 'pro_16',
    medicianName: [
      'Salbutamol', 'Budesonide', 'Formoterol', 'Montelukast', 'Theophylline',
      'Tiotropium', 'Ipratropium', 'Prednisolone', 'Cromolyn Sodium', 'Omalizumab',
      'Mepolizumab', 'Reslizumab', 'Dupilumab', 'Fluticasone', 'Ciclesonide',
      'Beclomethasone', 'Terbutaline', 'Leukotriene Receptor Antagonists', 'Salmeterol', 'Vilanterol'
    ]
  },
  {
    medicationId: 'med_17',
    problemId: 'pro_17',
    medicianName: [
      'Furosemide', 'Spironolactone', 'Eplerenone', 'Hydrochlorothiazide', 'Chlorthalidone',
      'Torsemide', 'Indapamide', 'Triamterene', 'Amiloride', 'Conivaptan',
      'Tolvaptan', 'Demeclocycline', 'Desmopressin', 'Acetazolamide', 'Mannitol',
      'Dorzolamide', 'Brinzolamide', 'Ethacrynic Acid', 'Methazolamide', 'Canrenone'
    ]
  },
  {
    medicationId: 'med_18',
    problemId: 'pro_18',
    medicianName: [
      'Alprazolam', 'Diazepam', 'Lorazepam', 'Clonazepam', 'Buspirone',
      'Fluoxetine', 'Sertraline', 'Citalopram', 'Escitalopram', 'Paroxetine',
      'Venlafaxine', 'Duloxetine', 'Bupropion', 'Mirtazapine', 'Trazodone',
      'Risperidone', 'Olanzapine', 'Quetiapine', 'Aripiprazole', 'Lithium'
    ]
  },
  {
    medicationId: 'med_19',
    problemId: 'pro_19',
    medicianName: [
      'Methotrexate', 'Azathioprine', 'Cyclophosphamide', 'Mycophenolate Mofetil', 'Leflunomide',
      'Sulfasalazine', 'Hydroxychloroquine', 'Etanercept', 'Infliximab', 'Adalimumab',
      'Tocilizumab', 'Anakinra', 'Abatacept', 'Rituximab', 'Belimumab',
      'Ustekinumab', 'Secukinumab', 'Apremilast', 'Tofacitinib', 'Baricitinib'
    ]
  },
  {
    medicationId: 'med_20',
    problemId: 'pro_20',
    medicianName: [
      'Tamsulosin', 'Finasteride', 'Dutasteride', 'Alfuzosin', 'Silodosin',
      'Prazosin', 'Terazosin', 'Doxazosin', 'Tolterodine', 'Oxybutynin',
      'Solifenacin', 'Darifenacin', 'Fesoterodine', 'Mirabegron', 'Desmopressin',
      'Phenazopyridine', 'Nitrofurantoin', 'Trimethoprim', 'Ciprofloxacin', 'Levofloxacin'
    ]
  }
]

export default medication
