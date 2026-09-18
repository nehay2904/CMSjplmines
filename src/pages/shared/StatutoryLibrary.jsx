import React, { useMemo, useState } from 'react';
import { Search, ArrowUpRight, FileX } from 'lucide-react';

/* ============================================================================
   StatutoryLibrary.jsx
   ONE page — Regulations, Codes of Practice, and Forms, switchable via tabs.
   All data below is your real data (from RulesRegulations.jsx,
   InternalMineDocuments.jsx, Forms.jsx) — nothing here is a placeholder.
   ============================================================================ */

/* ---------------------------------------------------------------------------
   SECTION 1: REGULATIONS DATA (source legislation PDFs)
--------------------------------------------------------------------------- */
const regulationDocs = [
  { title: 'Mines and Minerals Development and Regulation Act 1957', link: 'https://drive.google.com/file/d/1QG9oSWZ0bbah6g6OdsH6nuVqiUs4OUv2/view?usp=sharing', color: 'purple' },
  { title: 'Environment Protection Act 1986', link: 'https://drive.google.com/file/d/13cqC5gZ3Oj7uXBEVEwAoZIsnAKXUBCIV/view?usp=sharing', color: 'green' },
  { title: 'Mineral Concession Amendment Rules 2020', link: 'https://drive.google.com/file/d/110nZ7pMFZwHc0qxur6wqKkxzvwWbMk3h/view?usp=sharing', color: 'yellow' },
  { title: 'Coal colliery rules 2024', link: 'https://drive.google.com/file/d/1Y4bLZgPKVK8rukuVOvn0yp1HHmW4b7m9/view?usp=sharing', color: 'blue' },
  { title: 'Coal Mines Special Provisions Act 2015', link: 'https://drive.google.com/file/d/1vAOODYwv6QnbKp5UFbTece5Mkz5bspQM/view?usp=sharing', color: 'orange' },
  { title: 'Coal blocks Allocation Rules Amendment 2020', link: 'https://drive.google.com/file/d/1lkSU05CWqT2nhmPO-7Jdso2yQYKlIp7D/view?usp=sharing', color: 'purple' },
  { title: 'OSH Code 2020 (Occupational Safety, Health and Working Conditions Code, 2020)', link: 'https://drive.google.com/file/d/1SJJ1AamiI4H5F6qqjHgUXZ0ttk0XOI3b/view?usp=sharing', color: 'blue' },
  { title: 'CMR 2017 (Coal Mines Regulations, 2017)', link: 'https://drive.google.com/file/d/1NF9TpPqjyRkavmXML40i9iqnOtbkb9SF/view?usp=sharing', color: 'orange' },
  { title: 'OSH Central Rules 2026 (Occupational Safety, Health and Working Conditions Central Rules, 2026)', link: 'https://drive.google.com/file/d/1apaoSEccNgTUtynRJu2a_MMjwX38H5ga/view?usp=sharing', color: 'green' },
  { title: 'Electricity Act 2003', link: 'https://drive.google.com/file/d/1Row7fLCs-14gqDr1JcmNBWbUc8wp7GZK/view?usp=sharing', color: 'red' },
  { title: 'Central Electricity Authority (Measures relating to Safety and Electric Supply) Regulations, 2023', link: 'https://drive.google.com/file/d/1agplAk7P-30BEEdxzuaZkf6FrMXlfLYV/view?usp=sharing', color: 'purple' },
  { title: 'Explosive Act 1884', link: 'https://drive.google.com/file/d/1OUUbHG8DHg-JkhSmL-shWyKTvpGyziMd/view?usp=sharing', color: 'blue' },
  { title: 'The Explosives Rules, 2008', link: 'https://drive.google.com/file/d/1Uk_4ci225hXHieWmW7oyEU0if77I_k_A/view?usp=sharing', color: 'pink' },
  { title: 'Explosives (Amendment) Rules, 2025 - PESO', link: 'https://drive.google.com/file/d/1pAzytbDMN54Z3d6JBTtZi0LfWVV0ReS7/view?usp=sharing', color: 'red' },
  { title: 'Code on Wages, 2019', link: 'https://drive.google.com/file/d/1FQrZk1HGJMr7fjaQeIu9GAOPCoIZ0GPX/view?usp=sharing', color: 'teal' },
  { title: 'Industrial Relations Code, 2020', link: 'https://drive.google.com/file/d/1A9taCaBzSXLQ-5zMUK2Ysd8lLgtOxGIv/view?usp=sharing', color: 'yellow' },
  { title: 'Code on Social Security, 2020', link: 'https://drive.google.com/file/d/1O87wieU25LYWeH0dZoNqBhwpZZLduh4K/view?usp=sharing', color: 'indigo' },
];

const regColorMap = {
  blue: { dot: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
  orange: { dot: 'bg-orange-600', text: 'text-orange-600', light: 'bg-orange-50' },
  green: { dot: 'bg-green-600', text: 'text-green-600', light: 'bg-green-50' },
  purple: { dot: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50' },
  pink: { dot: 'bg-pink-600', text: 'text-pink-600', light: 'bg-pink-50' },
  red: { dot: 'bg-red-600', text: 'text-red-600', light: 'bg-red-50' },
  teal: { dot: 'bg-teal-600', text: 'text-teal-600', light: 'bg-teal-50' },
  yellow: { dot: 'bg-yellow-600', text: 'text-yellow-600', light: 'bg-yellow-50' },
  indigo: { dot: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50' },
};

/* ---------------------------------------------------------------------------
   SECTION 2: CODES OF PRACTICE (COP) DATA — 106 entries
--------------------------------------------------------------------------- */
const copDocs = [
  { title: 'COP 1 (Haul Road)', link: 'https://drive.google.com/file/d/1ZKz7tfBAIz3At9rTkHvMohWACS7RnANg/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 2 (For Supervisors)', link: 'https://drive.google.com/file/d/1K6Tu2t3yo6GpJ5R8bKsrPapygAfCE941/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 3 (Dumping in dumping yard)', link: 'https://drive.google.com/file/d/1AQFf6az6D5SI7fMpe_WkGxaF-Mfba_HQ/view?usp=drivesdk', color: 'green' },
  { title: 'COP 4 (fly ash)', link: 'https://drive.google.com/file/d/1GS6oNai7xyGAbl9sf6ghzko5S0nNuFYg/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 5 (Person engaged in stock piles)', link: 'https://drive.google.com/file/d/1yhVsvlsztkqq6RJctq3y_cG3I8pj5c4T/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 6 (Road Safety)', link: 'https://drive.google.com/file/d/1avVXQcj4FV42kjHoOGw14Han07sBdTdj/view?usp=drivesdk', color: 'red' },
  { title: 'COP 7 (Working system of Weigh bridge)', link: 'https://drive.google.com/file/d/19_oE93DaZOvJij6cm1Lv5L-DvKK7Dk1j/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 8 (Prevent Dump Failure)', link: 'https://drive.google.com/file/d/1gpajw5zI7NDd5ZhXoJ8yjaJifJff1Qj8/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 9 (Loading and Unloading Coal)', link: 'https://drive.google.com/file/d/1HXkUrROiDq9-7tUaRtZnlaNJnND5fYwU/view?usp=drivesdk', color: 'green' },
  { title: 'COP 10 (For dumper operators)', link: 'https://drive.google.com/file/d/1W5K09Y_wBN-VDhkSl8J3_CjK30SpGw61/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 11 (Excavator operators)', link: 'https://drive.google.com/file/d/1FqF23uSRwFhhwuw_Wy9Y7fG2Cqv42G47/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 12 (Loader Operation)', link: 'https://drive.google.com/file/d/1JZNAhjiQOAKui1HrVoljc4yyYBzyh6-W/view?usp=drivesdk', color: 'red' },
  { title: 'COP 13 (Grader Operator)', link: 'https://drive.google.com/file/d/1agUTDjm07Xjcr2LB4sSGV5rfRw1IcBU-/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 14 (Dozer Operations)', link: 'https://drive.google.com/file/d/13eAUDV7mtWyzkOhrqhXsd9f8UXWypdHM/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 15 (For Excavator Operations)', link: 'https://drive.google.com/file/d/1Ab4GeDDnLLSQ38I8YqR8DNCtrAl4i1UC/view?usp=drivesdk', color: 'green' },
  { title: 'COP 16 - Dozer Operators', link: 'https://drive.google.com/file/d/1iFLF2eQBFCO6qz_EEK_XQ59xXpSU0R2x/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 17 - Grader/Pay Loader Operators', link: 'https://drive.google.com/file/d/1XHwzmbkes5CMCjkxdnXeo5WFsUx5uA0a/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 18 - Crane/Hydra Operator', link: 'https://drive.google.com/file/d/1BPm7eELnuAMd33A1avEi9UDWRb1yXv-r/view?usp=drivesdk', color: 'red' },
  { title: 'COP 19 - Use of Diesel Bowzer', link: 'https://drive.google.com/file/d/1S7Rnz9eAiTH9DO2zOWpeskywhTlK4XgL/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 20 - Marching of Drill Machine', link: 'https://drive.google.com/file/d/1k-bwv1vz1oeHN4HqpcWZQ-D1jtDjJ0WS/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 21 - Dumper Operation', link: 'https://drive.google.com/file/d/1odL5kGASpy-CG5RCIoL_8w-BnZcS5QMm/view?usp=drivesdk', color: 'green' },
  { title: 'COP 22 - Operation of Crusher Systems', link: 'https://drive.google.com/file/d/1vwFHADPKET_vDbcEjXCVPKj4GKWkybR5/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 23 - Mining Machine Maintenance', link: 'https://drive.google.com/file/d/1LFkAlfiwYLleszvWlCsUG6JTjn1zrsEj/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 24 - Reversing Machines in Open Cast Mines', link: 'https://drive.google.com/file/d/1tAGiuHoKZ_uI7xrjVr85bX7XmSa3HHuX/view?usp=drivesdk', color: 'red' },
  { title: 'COP 25 - Diesel Tanker Operation', link: 'https://drive.google.com/file/d/13wps2SHnNISfRLZw6ZQfO_bYaE0J1uwC/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 26 - Operation of a Diesel-Powered Machine', link: 'https://drive.google.com/file/d/1Yb3ZGN4nCHBtzU0D6HlPAj60KsOqHCi0/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 27 - Operation of Surface Miner', link: 'https://drive.google.com/file/d/1VdI81vjzIMk4ANVlHZeb2m5xRQk_0D9s/view?usp=drivesdk', color: 'green' },
  { title: 'COP 28 - Design and Maintenance of Surface Miner', link: 'https://drive.google.com/file/d/1Vp_U_ZH3B5pYWa9Ex3-y2rnn3bu6kK4R/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 29 - Operation of Vibro Ripper', link: 'https://drive.google.com/file/d/1sEr_Hn_48EVsFkf03eRAhNRUEEsKNvjd/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 30 - Water Tanker Operators', link: 'https://drive.google.com/file/d/1wnvR2AB-wJNtZqardw1duKzb9W9XTc5u/view?usp=drivesdk', color: 'red' },
  { title: 'COP 31 - Grader Repair Work', link: 'https://drive.google.com/file/d/195ytceNxmSd4Ou8AaSTFmZ6mQtiYug6q/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 32 - Deployment of Equipment at Gare Palma IV/2&3 Mine', link: 'https://drive.google.com/file/d/1f5S_A3tc7SUsmvy0dSxOrEw5UC-hMFrg/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 33 - Vehicle Parking and Starting Rules', link: 'https://drive.google.com/file/d/1_wqo4geVTLboqxAHNBkwaK30mVS7SBua/view?usp=drivesdk', color: 'green' },
  { title: 'COP 34 - Transport Rules', link: 'https://drive.google.com/file/d/1L1YSPlbAIAXijh3OLM7gcxcFM7C2Yp9k/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 35 - Tyre Dismantling and Assembling', link: 'https://drive.google.com/file/d/1iG3d-SBcfdq0PkzDA3RHrGggsHPduO4l/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 36 - Light Vehicle Drivers (Private and Company)', link: 'https://drive.google.com/file/d/1XnzgemCEuqUwrP6HO-961Bo-iCn_2L1K/view?usp=drivesdk', color: 'red' },
  { title: 'COP 37 - Brake Testing', link: 'https://drive.google.com/file/d/1is6dLwCkX4idTzLuNhz3e1CnCsQFL5Ux/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 38 - Drilling Operation', link: 'https://drive.google.com/file/d/10ZNYbOQaGFjsE-RE-RmD3RB26dGWc5oV/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 39 - Magazine', link: 'https://drive.google.com/file/d/1zQ_6Tt8Lnkxr3jbRNrv551LlMPPVL2K6/view?usp=drivesdk', color: 'green' },
  { title: 'COP 40 - Transport of Explosives in Bulk', link: 'https://drive.google.com/file/d/1NzYTbYJQ0yjKUzje-6cWVOhJ2dBciRrE/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 41 - Bulk Mixing Delivery (BMD)/BDS Vehicles', link: 'https://drive.google.com/file/d/1rQhpNJblPdDsChsj7SqpMzt_fN7Yc_9I/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 42 - Specification of BMD/BDS Vehicles', link: 'https://drive.google.com/file/d/1fhYY8JsO40GKW4N3HG8q3-CdO2RLfppI/view?usp=drivesdk', color: 'red' },
  { title: 'COP 43 - Explosive Van', link: 'https://drive.google.com/file/d/1BGWpoWvegD2k4nQ7-bG_iPaTHm45yNs9/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 44 - Handling SMS/SME', link: 'https://drive.google.com/file/d/18jDV2Tox75pC68G_s6kOb33d3PoByiLt/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 45 - Use of SME Explosive', link: 'https://drive.google.com/file/d/1Bn37mf4Bu5uqjHqbz58hpikhQilWItGU/view?usp=drivesdk', color: 'green' },
  { title: 'COP 46 - Prevention of Pilferage (Theft) of Explosive', link: 'https://drive.google.com/file/d/1FPygtl-Fc6y9k93n8m0Yv14_9O38JXYQ/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 47 - Conducting Blasting in Fire Area', link: 'https://drive.google.com/file/d/1xE4gJ-tjXuIfMJiO97A8Go2lyX5ppepu/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 48 - Shotfirer', link: 'https://drive.google.com/file/d/1U6CvKaZOKEWIIo2PN5xpp61XLHR9oVXv/view?usp=drivesdk', color: 'red' },
  { title: 'COP 49 - Blasting Crew', link: 'https://drive.google.com/file/d/1qw0zHg0b8TKFxjNUeey5i2hzhJaP5s_5/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 50 - Deep Hole Blasting', link: 'https://drive.google.com/file/d/1TYzObFl_mNcDWbWUCExBiEhP28opT0Hr/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 51 - Safe and Healthy Work Place While Blasting', link: 'https://drive.google.com/file/d/1TRAJ5-lz5gBF9Jd39fcasHuiTwjmYSjT/view?usp=drivesdk', color: 'green' },
  { title: 'COP 52 - Shelter During Blasting', link: 'https://drive.google.com/file/d/154fp9mNGx7_790bhVK5s6g7e5KcipwTU/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 53 - Putting a (New) Battery Into Service', link: 'https://drive.google.com/file/d/10bPCqy5QNa9JrcUP-r_kwsDrfmqcloVU/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 54 - Erection, Dismantling & Transportation of Electrical Pole/Tower', link: 'https://drive.google.com/file/d/1P5gCfBBjLJWoCFKyHXb5CPAWtEaFJZLk/view?usp=drivesdk', color: 'red' },
  { title: 'COP 55 - Safety and Maintenance of Battery and Electrical System', link: 'https://drive.google.com/file/d/12lScUh40dAJsmV0Vul6pA4GAAtDPQFGN/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 56 - Safe Use of Electricity', link: 'https://drive.google.com/file/d/1OqIeyk0TsRwYWG5ARgnTDz8G5lY45jQ0/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 57 - Electricians', link: 'https://drive.google.com/file/d/17UPzvm0SWGs-mspMMRDRNlBe5dK3DNSW/view?usp=drivesdk', color: 'green' },
  { title: 'COP 58 - Electrical Maintenance and Shutdown', link: 'https://drive.google.com/file/d/10eaQCGWRWHdOcARiBTkov7ufw8t1AOuG/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 59 - Working in Overhead Line', link: 'https://drive.google.com/file/d/1034V1P-fkwlbjFGEG_4huOguwTHWWBBy/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 60 - Shifting of DG Lighting Tower', link: 'https://drive.google.com/file/d/1oD4wIRg3jVTwgV_0cAmujUv_pn80BhP6/view?usp=drivesdk', color: 'red' },
  { title: 'COP 61 - Mechanical/Electrical/Fitters for Safety of Machines', link: 'https://drive.google.com/file/d/1HOQu32xFgXF6HufYZybanrjTcpMf4VMv/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 62 - Electrician Working on the Pole', link: 'https://drive.google.com/file/d/1j70DIzEE4QX3K1_gIhIXLHF_vaG5Ihnq/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 63 - Electrical Safety', link: 'https://drive.google.com/file/d/1fKmFYsiOCNtr8RogL5LVDxye0y_1Euc3/view?usp=drivesdk', color: 'green' },
  { title: 'COP 64 - Shutting Down Power in Open Cast Mines', link: 'https://drive.google.com/file/d/1TntHD1ulB6yCyRAPoBNnCiCH6RT_GU0f/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 65 - Use of Compressed Air', link: 'https://drive.google.com/file/d/1dRjXkEoNJrbzMLArKcAftuVRXsWYmd2R/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 66 - Work at Height', link: 'https://drive.google.com/file/d/1oP0N_2EPz5tnA0-nChDCbunY-F0PWwi3/view?usp=drivesdk', color: 'red' },
  { title: 'COP 67 - Installation, Operation & Erection of Pumps & Pipe Lines', link: 'https://drive.google.com/file/d/1r98Rsg7MFqXAJcs6Hyyzhq6RaJqXesrB/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 68 - Pump Operator', link: 'https://drive.google.com/file/d/1u5znIh5fZtaOb6nIlQ2iHkoMKJYgdBSl/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 69 - Use of Ladders', link: 'https://drive.google.com/file/d/1g-x6RZfbxQ5cGh_kr9MY2PkViI83g99I/view?usp=drivesdk', color: 'green' },
  { title: 'COP 70 - Use of Hand Tools', link: 'https://drive.google.com/file/d/1XiA7vrGr7sEHS5Jmo_GuY0-lx5-i2pqu/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 71 - Material Handling (Mechanical)', link: 'https://drive.google.com/file/d/1Vp5UpLRM9hUXhdxroojH7CEDez_fBJoZ/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 72 - Material Handling (Manual)', link: 'https://drive.google.com/file/d/1eR6v2DufllgvT6FTiYPGLh9tcL3J14u/view?usp=drivesdk', color: 'red' },
  { title: 'COP 73 - Filling of Diesel', link: 'https://drive.google.com/file/d/1sE3WJz5yjS6UNb0EnmXrE39Elm4swCKH/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 74 - Use of Oil and Grease', link: 'https://drive.google.com/file/d/1T8mP7byFozgJpcSn91EP5s4_RkTRhNzJ/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 75 - Lifting and Carrying Heavy Goods', link: 'https://drive.google.com/file/d/16mgtM6nsq6S5GFXUU1J3hVbAxbUJ_vM7/view?usp=drivesdk', color: 'green' },
  { title: 'COP 76 - Personal Safety Tools', link: 'https://drive.google.com/file/d/1NAgJV8FYEX2_rHiwjVG6XbSum9Mxjpxp/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 77 - Method of Cutting Trees', link: 'https://drive.google.com/file/d/1wm5ZQSc3s6ATz-FkECvQgDGrMZ6q0PWv/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 78 - Welding and Cutting', link: 'https://drive.google.com/file/d/1IKP3_1ViqUWGD52qGPwpaRKpa_4a5VRY/view?usp=drivesdk', color: 'red' },
  { title: 'COP 79 - Safe Against Fire Danger', link: 'https://drive.google.com/file/d/19lLup50CKMz3iFPpmpGqBvo-S53ZlrhZ/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 80 - Fire Fighting', link: 'https://drive.google.com/file/d/1aJvEOCnwmkMJUhjT8as6d9BFnfDVy8F0/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 81 - First-Aid Box Management System', link: 'https://drive.google.com/file/d/1e-LpAHbnrisFWrjbiNiPhjz-LI-n2WKu/view?usp=drivesdk', color: 'green' },
  { title: 'COP 82 - Precaution Against Heat and Sun in Summer Season', link: 'https://drive.google.com/file/d/1ADsbmfw4pz9gytF4Ez0WcJr7Bd1ZB3Y_/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 83 - Prevention of Accident in Office', link: 'https://drive.google.com/file/d/1QijwP3h9vUUFeIf-PY4VJnoO3RD0Ra4D/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 84 - Persons Employed in Mine', link: 'https://drive.google.com/file/d/1RdVxTKLSz8sJ1Jo1HOQwjkuloXPgo93H/view?usp=drivesdk', color: 'red' },
  { title: 'COP 85 - Issuing I Card, GP IV/2&3 Coal Mine', link: 'https://drive.google.com/file/d/1_N1YLrWdjEWghNlwm4ygl-eQ5vL94yzV/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 86 - Attendance Clerk/Register Keeper', link: 'https://drive.google.com/file/d/1GAExHkxOFCkBqNH_ed8npmRoQ-qaRTgc/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 87 - Visitors/OEM Suppliers', link: 'https://drive.google.com/file/d/1L7mqHNLKmRvHK1Y7G8QJApvLBaPrjQXv/view?usp=drivesdk', color: 'green' },
  { title: 'COP 88 - All Contractor Workers Working in Mine Premises', link: 'https://drive.google.com/file/d/1jxgHr8TRKPjIuvPCrCtM5-XtzaKy62d_/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 89 - Security Guard Appointed at the Gate', link: 'https://drive.google.com/file/d/1y3b6cqFO-xpK1w0jS2H58n129NEfBzAL/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 90 - Housekeeping', link: 'https://drive.google.com/file/d/1g9BTMSdkHKaQRIvYyM_M91rrATYA4RSe/view?usp=drivesdk', color: 'red' },
  { title: 'COP 91 - Coal Core Sampling at Mine', link: 'https://drive.google.com/file/d/1faNmY9K6rdF7q-T4c7JqyDKg5r4dj9zd/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 92 - Replacement of Hose Kit', link: 'https://drive.google.com/file/d/1HGmp4xxaerr5FIEEY6Eu90T2EJfSQs9p/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 93 - Trip Man', link: 'https://drive.google.com/file/d/1zj6cNWKcLSi7dG1xOR51k3IikUyuafzd/view?usp=drivesdk', color: 'green' },
  { title: 'COP 94 - Airborne Dust Survey', link: 'https://drive.google.com/file/d/1TsHj0jF1joVikyEPRidz0aDFq9dVDyUa/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 95 - Calibration of PDS (Side Kick-51EX)', link: 'https://drive.google.com/file/d/1E9Xsv7D_SeZe13nlZzaRSA4B73axgpqk/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 96 - Safety Instructions for Compressor Operation', link: 'https://drive.google.com/file/d/1u0aDXKelH7WZ6JZNdYi5CaUJlD2Kxb2e/view?usp=drivesdk', color: 'red' },
  { title: 'COP 97 - No Use of Mobile Phones During Fly Ash Dumping Operation', link: 'https://drive.google.com/file/d/121uclTjkPDl_UlW0ilVDtJDjIkd8xtz-/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 98 - Refuelling a Vehicle Loaded with Explosives', link: 'https://drive.google.com/file/d/1R5CMUTYHlWRNhGHDSP85x1J2kbPF65Gz/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 99 - Dealing with Misfires', link: 'https://drive.google.com/file/d/1JTrD6oeFLrs_KwpIkstE-SeZQvMowqK1/view?usp=drivesdk', color: 'green' },
  { title: 'COP 100 - Dispatch of Coal', link: 'https://drive.google.com/file/d/1fufe0C5uKmURozd_bqUPzWomXn7Nf4Id/view?usp=drivesdk', color: 'purple' },
  { title: 'COP 101 - 9-Meter Drilling, Charging, and Blasting Operations', link: 'https://drive.google.com/file/d/1VJ5noePuhxHtm7aTL4T6hm3FMd9v0Gij/view?usp=drivesdk', color: 'pink' },
  { title: 'COP 102 - Safe Tarpaulin Handling on Fly Ash Dumpers', link: 'https://drive.google.com/file/d/1f-xYxlTPQBpN32YYSV6bfLXGXlt6E-cB/view?usp=drivesdk', color: 'red' },
  { title: 'COP 103 - Bench Formation Work (Pit-1, Gare Palma IV/2&3)', link: 'https://drive.google.com/file/d/1BmgffmFx1piHcC4_xoTlPixsNu3feB3g/view?usp=drivesdk', color: 'blue' },
  { title: 'COP 104 - Working Near Geologically Disturbed Areas', link: 'https://drive.google.com/file/d/1alDopXXbU5FhK9BW9C06ed_sqj4GFJF-/view?usp=drivesdk', color: 'orange' },
  { title: 'COP 105 -COP FOR ANFO HANDLING, TRANSPORTATION, MIXING, CHARGING AND BLASTING:', link: 'https://docs.google.com/document/d/1g0iKj9YMOdgXMRyD_m193oCOz0gygsBP/edit?usp=sharing&ouid=102999237454234972119&rtpof=true&sd=true', color: 'blue' },
  { title: 'COP 106 - COP for crushing of Coal through Mobile Crusher', link: 'https://docs.google.com/document/d/1B4o7ttuFuhtrxeRwWQvkRMq06vhVflRd/edit?usp=sharing&ouid=102999237454234972119&rtpof=true&sd=true', color: 'orange' },
];

const copCategoryStyles = {
  blue: { tab: 'bg-blue-500', chip: 'text-blue-700 bg-blue-50 ring-blue-600/20' },
  orange: { tab: 'bg-amber-500', chip: 'text-amber-700 bg-amber-50 ring-amber-600/20' },
  green: { tab: 'bg-emerald-500', chip: 'text-emerald-700 bg-emerald-50 ring-emerald-600/20' },
  purple: { tab: 'bg-violet-500', chip: 'text-violet-700 bg-violet-50 ring-violet-600/20' },
  pink: { tab: 'bg-rose-500', chip: 'text-rose-700 bg-rose-50 ring-rose-600/20' },
  red: { tab: 'bg-red-500', chip: 'text-red-700 bg-red-50 ring-red-600/20' },
};

const pad = (n) => String(n).padStart(3, '0');
const getCode = (title) => {
  const match = title.match(/COP\s*(\d+)/i);
  return match ? match[1] : '?';
};

/* ---------------------------------------------------------------------------
   SECTION 3: FORMS DATA — OSH / CMR / Explosives / CER
--------------------------------------------------------------------------- */
const oshForms = [
  { id: '1', form: 'FORM I', title: 'Application for registration of establishment / Amendment to certificate / Updation of registration particulars', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule 3(1)', recurrence: 'Event-based (at commencement; within 30 days of any change; within 6 months for existing registrations)', mode: 'FORM I (online - Shram Suvidha Portal)', signingAuthority: 'Employer / Occupier / Owner / Agent / Chief Executive (Signature/E-sign/Digital Sign)', submissionAuthority: 'Registering Officer (via Shram Suvidha Portal / designated portal)', timeline: 'Within 60 days of applicability; 6 months for existing establishments', link: 'https://drive.google.com/file/d/1ZymNVlL733ZETruVP1U3zQ83_m7ehvO5/view?usp=drive_link' },
  { id: '2', form: 'FORM V ', title: 'The registering officer shall maintain in FORM-V showing the particulars of establishment in relation to which certificates of registration have been issued.', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule  3(9)', recurrence: 'event based (maintained by authority; updated on new registrations / amendments)', mode: 'FORM V (online/electronic)', signingAuthority: 'Owner / Agent / Manager of Mine (Employer)', submissionAuthority: 'Maintained in mines', timeline: '', link: 'https://drive.google.com/file/d/15xZcGxD57HK3UYLUpYrln7Nl_h7Ct6UF/view?usp=drive_link' },
  { id: '3', form: 'FORM VII', title: 'Notice of Commencement / Re-opening / Cessation / Discontinuance / Abandonment of operations / Closing of mines', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule 4(2)', recurrence: 'Event-based (prior notice >= 30 days before commencement / cessation / abandonment)', mode: 'FORM VII (online/electronic)', signingAuthority: 'Owner / Agent / Manager of Mine (Employer)', submissionAuthority: 'Inspector-cum-Facilitator (jurisdiction) + Registering Officer', timeline: 'Not less than 30 days prior notice', link: 'https://drive.google.com/file/d/146IwGqZ40PFA8zUFTwr7cr94mtHKi-6F/view?usp=drive_link' },
  { id: '4', form: 'FORM IX', title: 'Report of medical examination (For mine employees only) - initial, periodic (annual), and special examinations', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rules 109, 113(1), 119(1), 142', recurrence: 'Annual (periodic); Event-based for initial & special examinations', mode: 'FORM IX', signingAuthority: 'Qualified Medical Practitioner (signs examination certificate); Employer (arranges & maintains records)', submissionAuthority: 'Maintained by employer on-site; copy to Inspector-cum-Facilitator / Chief Inspector-cum-Facilitator on demand', timeline: 'Initial: before employment; Periodic: annually; Special: as directed', link: 'https://drive.google.com/file/d/1KHKbsyVa-Edi093DTipexlmiTymmGFgh/view?usp=drive_link' },
  { id: '5', form: 'FORM XI', title: 'Notice of accident or dangerous occurrence', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rules 7(1) and 7(2)', recurrence: 'Event-based (immediately on death; within 12 hrs after 48-hr disability threshold)', mode: 'FORM XI (electronic + telephone for deaths)', signingAuthority: 'Employer / Occupier / Manager / Agent (of the establishment)', submissionAuthority: 'Inspector-cum-Facilitator; Chief Inspector-cum-Facilitator; District Magistrate / SDO; Police Station in-charge; Family of victim', timeline: 'Forthwith (death); within 12 hrs after 48 hrs disability; within 12 hrs for dangerous occurrences', link: 'https://drive.google.com/file/d/16pAK5_n61KqSDku6FFGxgMq4j5D5j9n3/view?usp=drive_link' },
  { id: '6', form: 'FORM XII', title: 'Notice of periods of work (to be displayed and sent to Inspector-cum-Facilitator)', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule 71', recurrence: 'Event-based (whenever work hours schedule is set or revised) + Ongoing display', mode: 'FORM XII (notice board / electronic board)', signingAuthority: 'Employer / Manager of the establishment', submissionAuthority: 'Inspector-cum-Facilitator (electronically or by speed post); displayed at conspicuous place within establishment', timeline: 'Before commencement of work schedule; revised notice on any change', link: 'https://drive.google.com/file/d/12umBoIbxALzeGJeAPi6tKIhd3-m0Ajt4/view?usp=drive_link' },
  { id: '7', form: 'FORM XIII', title: 'Employee register', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule 72(1)(i)', recurrence: 'Ongoing / Continuous maintenance; produced during inspection on demand', mode: 'FORM XIII (electronic or physical)', signingAuthority: 'Employer / Manager of the establishment', submissionAuthority: 'Maintained at establishment; produced to Inspector-cum-Facilitator on demand', timeline: 'Maintained continuously; updated on any change in employee details', link: 'https://drive.google.com/file/d/1gOIe0riRUohfSKw_dFSsfe4ceAfJSXh3/view?usp=drive_link' },
  { id: '8', form: 'FORM XIV', title: 'Attendance register-cum-muster roll', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule 72(1)(ii)', recurrence: 'Ongoing / Continuous (daily attendance; monthly muster rolls)', mode: 'FORM XIV (electronic or physical)', signingAuthority: 'Employer / Manager / Person responsible for supervision', submissionAuthority: 'Maintained at establishment; produced to Inspector-cum-Facilitator on demand', timeline: 'Maintained daily; available on demand', link: 'https://drive.google.com/file/d/1IuBByBDQe8tvr2XhlaS8XNxPMi_2BvF_/view?usp=drive_link' },
  { id: '9', form: 'FORM XV', title: 'Register for wages, overtime and deductions', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule 72(1)(iii)', recurrence: 'Ongoing / Continuous maintenance (updated each wage period)', mode: 'FORM XV (electronic or physical)', signingAuthority: 'Employer / Manager of the establishment', submissionAuthority: 'Maintained at establishment; produced to Inspector-cum-Facilitator on demand', timeline: 'Maintained every wage period; available on demand', link: 'https://drive.google.com/file/d/1zIxgA5Jc4Oopa0DfNUOIQoVCgIDYFrsC/view?usp=drive_link' },
  { id: '10', form: 'FORM XVI', title: 'Wage slip', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule 72(2)', recurrence: 'Per wage payment cycle (weekly / fortnightly / monthly)', mode: 'FORM XVI (electronic to employees)', signingAuthority: 'Employer / Manager of the establishment', submissionAuthority: 'Issued electronically to each employee', timeline: 'On or before the day of payment of wages', link: 'https://drive.google.com/file/d/18rEawngcU8eeK13HL07xHtPshPXU_owf/view?usp=drive_link' },
  { id: '11', form: 'FORM XVII', title: 'Annual Return (employer of establishment + principal employer for Part III - contract labour)', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rules 98(9) & 72 r/w 74', recurrence: 'Annual (Calendar year basis - Jan to Dec)', mode: 'FORM XVII (electronic on Shram Suvidha Portal)', signingAuthority: 'Employer / Occupier / Principal Employer', submissionAuthority: 'Inspector-cum-Facilitator (jurisdiction); Deputy Chief Labour Commissioner (Central) - for principal employer Part III', timeline: 'On or before last day of February following end of Calendar year', link: 'https://drive.google.com/file/d/1RPXy65dvPaEGEFIiBBvQhRrxpBysHIS4/view?usp=sharing' },
  { id: '12', form: 'FORM XVIII', title: 'Half Yearly Return (Contractor - January to June / July to December)', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rules 72(5) and 98(7)', recurrence: 'Half-Yearly (Jan-Jun and Jul-Dec)', mode: 'FORM XVIII (electronic)', signingAuthority: 'Contractor (who engages contract labour)', submissionAuthority: 'Deputy Chief Labour Commissioner (Central) concerned', timeline: 'Within 30 days from close of each half-year (by 30 July and 30 January)', link: 'https://drive.google.com/file/d/16u1WLyAPLTxA6slyHUUDmQP0OKGB4wYT/view?usp=sharing' },
  { id: '13', form: 'FORM XIX', title: 'Register of accidents and dangerous occurrences', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule 75', recurrence: 'Ongoing / Continuous maintenance; event-based entries', mode: 'FORM XIX (electronic or physical)', signingAuthority: 'Employer / Manager / Safety Officer', submissionAuthority: 'Maintained at establishment; available to Inspector-cum-Facilitator on demand', timeline: 'Entry made immediately after each accident/dangerous occurrence', link: 'https://drive.google.com/file/d/14LBQ10Yl7Eld9ERPxYuo9IVQ6ex5DKQV/view?usp=sharing' },
  { id: '14', form: 'FORM XX', title: 'Register for leave with wages', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule 76', recurrence: 'Ongoing / Continuous; shared with employee annually (on demand)', mode: 'FORM XX (electronic or physical)', signingAuthority: 'Employer / Manager of the establishment', submissionAuthority: 'Maintained at establishment; shared with each employee once per calendar year', timeline: 'Maintained continuously; annual sharing with employee', link: 'https://drive.google.com/file/d/1tLaLPC2JXhk7VTeOdvNeytmATGP-YJSD/view?usp=drive_link' },
  { id: '15', form: 'FORM XXI', title: 'Application for Licence / Renewal of Licence / Amendment of Licence - Contractor', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rules 87, 88(1) and 96(1)', recurrence: 'Event-based (fresh licence / renewal / amendment); Renewal: before expiry of licence', mode: 'FORM XXI (online - Shram Suvidha Portal)', signingAuthority: 'Contractor (Employer) - Signature/E-sign/Digital Sign', submissionAuthority: 'Registering Officer / Labour Commissioner (jurisdiction) via Shram Suvidha Portal', timeline: 'Before commencement of contract work; renewal before licence expiry', link: 'https://drive.google.com/file/d/1blI5rb_4FRAJkX3GuwsWM_HSIJzvtqeQ/view?usp=sharing' },
  { id: '16', form: 'FORM XXII', title: 'Proforma of Labour Licence (issued to contractor)', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rules 89(1) and 90(2)', recurrence: 'Event-based (issued on grant / renewal)', mode: 'FORM XXII (issued by authority; displayed at establishment)', signingAuthority: 'Registering Officer / Licensing Authority (signs and issues the licence)', submissionAuthority: 'Issued by Registering Officer / Licensing Authority to the Contractor', timeline: 'Issued within prescribed time on complete application; displayed continuously', link: 'https://drive.google.com/file/d/1vcjmOeBfj-jUIJk6EIrzAs27ui9YOV6A/view?usp=sharing' },
  { id: '17', form: 'FORM XXIII', title: 'Experience certificate of contract labour', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule 100', recurrence: 'Event-based (on demand by contract worker)', mode: 'FORM XXIII', signingAuthority: 'Concerned Contractor (who employed the contract labour)', submissionAuthority: 'Issued directly to the contract labour worker (employee) on demand', timeline: 'On demand by contract worker', link: 'https://drive.google.com/file/d/1fHyOVoJllRp0Z_HEd8kQe5ccJvpyhPUC/view?usp=sharing' },
  { id: '18', form: 'FORM XXVI', title: 'Application for composition of offence', regulation: 'OSH', rule: 'OSH (Central) Rules 2026 ,Rule 182(1)', recurrence: 'Event-based (on commission of compoundable offence)', mode: 'FORM XXVI (electronic)', signingAuthority: 'Accused person (employer or other person committing compoundable offence)', submissionAuthority: 'Officer notified by Central Government for compounding of offences under Section 114', timeline: 'Before or after enquiry or institution of prosecution', link: '' },
];

const cmrForms = [
  { id: 'cmr-1', form: 'FORM 1-A', title: 'Notice of opening', regulation: 'CMR', rule: 'CMR 2017, Regulation 3', recurrence: 'Event-based (on opening of a mine)', mode: 'FORM 1-A (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines (DGMS, Dhanbad); Regional Inspector of Mines; District Magistrate', timeline: 'Before the intended date of opening; actual date of opening to be furnished thereafter', link: 'https://drive.google.com/file/d/1-5giw-nhO3wfEe9tl6LEa7_Dff_Q41YY/view?usp=sharing' },
  { id: 'cmr-2', form: 'FORM 1-B', title: 'Notice of reopening', regulation: 'CMR', rule: 'CMR 2017, Regulation 6', recurrence: 'Event-based (on reopening of a mine)', mode: 'FORM 1-B (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines (DGMS, Dhanbad); Regional Inspector of Mines; District Magistrate', timeline: 'Before the intended date of reopening; actual date of reopening to be furnished thereafter', link: 'https://drive.google.com/file/d/1yCRyRgUbN2CsJsCv778CRVw9K4393ohi/view?usp=sharing' },
  { id: 'cmr-3', form: 'FORM 1-C', title: 'Notice of closure/abandonment', regulation: 'CMR', rule: 'CMR 2017, Regulation 5', recurrence: 'Event-based (on closure or abandonment of a mine)', mode: 'FORM 1-C (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines (DGMS, Dhanbad); Regional Inspector of Mines; District Magistrate', timeline: 'Before intended date of closure/abandonment; actual date to be furnished thereafter', link: 'https://drive.google.com/file/d/1xKvZZjdYjOXYpOSoJSLHBINkt3tXjfTC/view?usp=drive_link' },
  { id: 'cmr-4', form: 'FORM 1-D', title: 'Notice of discontinuance', regulation: 'CMR', rule: 'CMR 2017, Regulation 5', recurrence: 'Event-based (on discontinuance of a mine)', mode: 'FORM 1-D (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines (DGMS, Dhanbad); Regional Inspector of Mines; District Magistrate', timeline: 'Before intended date of discontinuance; actual date to be furnished thereafter; updated plans under Regulation 66 to be enclosed', link: 'https://drive.google.com/file/d/1JihQB3lR21JMoMcvzqzlYCE4VK8Z05gJ/view?usp=drive_link' },
  { id: 'cmr-5', form: 'FORM 2-A', title: 'Notice of change in name of mine', regulation: 'CMR', rule: 'CMR 2017, Regulation 7', recurrence: 'Event-based (on change in name of mine)', mode: 'FORM 2-A (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines (DGMS, Dhanbad); Regional Inspector of Mines', timeline: 'On/following the date of change of mine name', link: 'https://drive.google.com/file/d/1NqcqzxMTjYsaegl5hvTeRVNcTksilM28/view?usp=drive_link' },
  { id: 'cmr-6', form: 'FORM 2-B', title: 'Notice of change in the ownership of a mine', regulation: 'CMR', rule: 'CMR 2017, Regulation 7', recurrence: 'Event-based (on change in ownership of mine)', mode: 'FORM 2-B (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines (DGMS, Dhanbad); Regional Inspector of Mines', timeline: 'On/following the date of change in ownership', link: 'https://drive.google.com/file/d/1NEqx1XJpxJTpaKUpOM9qwm34e-nYuM3s/view?usp=drive_link' },
  { id: 'cmr-7', form: 'FORM 2-C', title: 'Notice of change in the address of the Owner, agent or manager', regulation: 'CMR', rule: 'CMR 2017, Regulation 7', recurrence: 'Event-based (on change of address of owner/agent/manager)', mode: 'FORM 2-C (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines (DGMS, Dhanbad); Regional Inspector of Mines', timeline: 'On/following the date of change of address', link: 'https://drive.google.com/file/d/1juH4Z4BiNHhUENEGyEVq6_nuTJMUIOCR/view?usp=drive_link' },
  { id: 'cmr-8', form: 'FORM 2-D', title: 'Notice of appointment of agent, manager, etc.', regulation: 'CMR', rule: 'CMR 2017, Regulation 7', recurrence: 'Event-based (on appointment of agent/manager/engineer/surveyor/ventilation officer/safety officer/assistant manager)', mode: 'FORM 2-D (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines (DGMS, Dhanbad); Regional Inspector of Mines', timeline: 'On/following the date of appointment', link: 'https://drive.google.com/file/d/1PsJSBpfPktcmzAsRDAI-xurVnECc3h0y/view?usp=drive_link' },
  { id: 'cmr-9', form: 'FORM 2-E', title: 'Notice of termination of agent, manager, etc.', regulation: 'CMR', rule: 'CMR 2017, Regulation 7', recurrence: 'Event-based (on termination of agent/manager/engineer/surveyor/ventilation officer/safety officer/assistant manager)', mode: 'FORM 2-E (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines (DGMS, Dhanbad); Regional Inspector of Mines', timeline: 'On/following the date of termination of appointment', link: 'https://drive.google.com/file/d/1TPGZldoDuWxlPfp0ematE0AYfbnDf_q6/view?usp=drive_link' },
  { id: 'cmr-10', form: 'FORM 3', title: 'Annual returns', regulation: 'CMR', rule: 'CMR 2017, Regulation 4', recurrence: 'Annual (for the year ending 31st December)', mode: "FORM 3 (physical submission, signed with Manager's seal)", signingAuthority: 'Manager', submissionAuthority: 'Directorate General of Mines Safety (DGMS)', timeline: 'To be submitted after 31st December for the year ending on that date', link: 'https://drive.google.com/file/d/1q1fuVA5YqIOWY4gd2jAkyWMAqYql7I2l/view?usp=sharing' },
  { id: 'cmr-11', form: 'FORM 4-A', title: 'Notice of Accident/Dangerous Occurrence', regulation: 'CMR', rule: 'CMR 2017, Regulation 8', recurrence: 'Event-based (on fatal/serious accident or dangerous occurrence)', mode: 'FORM 4-A (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines/DGMS; Regional Inspector of Mines/Director of Mines Safety (Region)/Dy. Director in charge of Sub-Region; District Magistrate/Collector; Electrical Inspector of Mines (electrical accidents only); Competent Authority for compensation (where applicable under Reg. 8(1)(a))', timeline: 'Immediately on occurrence of the accident/dangerous occurrence', link: 'https://drive.google.com/file/d/1zdmLB_RV61t7gg4qFdVZkhunamIMs-3I/view?usp=drive_link' },
  { id: 'cmr-12', form: 'FORM 4-B', title: 'Particulars of deceased/injured person(s)', regulation: 'CMR', rule: 'CMR 2017, Regulation 8', recurrence: 'Event-based (following a fatal/serious accident)', mode: 'FORM 4-B (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines/DGMS; Regional Inspector of Mines/Director of Mines Safety (Region)/Dy. Director in charge of Sub-Region', timeline: 'Within 7 days of occurrence of the accident', link: 'https://drive.google.com/file/d/1V52MSKKf1F93i9JpvLr82HksC9qvjZ54/view?usp=drive_link' },
  { id: 'cmr-13', form: 'FORM 4-C', title: "Particulars of injured person(s) returning to duty", regulation: 'CMR', rule: 'CMR 2017, Regulation 8', recurrence: 'Event-based (per injured person returning to duty)', mode: 'FORM 4-C (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines/DGMS; Regional Inspector of Mines/Director of Mines Safety (Region)/Dy. Director in charge of Sub-Region', timeline: "Within 15 days of the injured person's return to duty", link: 'https://drive.google.com/file/d/15x557BYF7KnlV1Yqm8zrnIAUD6K-eGTZ/view?usp=drive_link' },
  { id: 'cmr-14', form: 'FORM 5', title: 'Notice of disease notified under section 25 of the Mines Act', regulation: 'CMR', rule: 'CMR 2017, Regulation 9', recurrence: 'Event-based (on notification of an occupational disease)', mode: 'FORM 5 (physical/postal submission)', signingAuthority: 'Owner / Agent / Manager', submissionAuthority: 'Chief Inspector of Mines, DGMS; Regional Inspector of Mines; Inspector of Mines (Medical), DGMS; District Magistrate/Collector; Competent Authority for payment of compensation', timeline: 'On detection/notification of the disease', link: 'https://drive.google.com/file/d/185uWECmajIFtt1Snq2gCs0fQPxSC5Smq/view?usp=drive_link' },
  { id: 'cmr-15', form: 'FORM 6', title: 'Pointing out of contraventions during Inspections', regulation: 'CMR', rule: 'CMR 2017, Regulation 117', recurrence: 'Event-based (during each statutory inspection)', mode: 'FORM 6 (physical inspection record)', signingAuthority: 'Inspection Officer (IO) and accompanying Mine Official', submissionAuthority: 'Recorded at mine; further details of contraventions, if any, followed up by letter from Inspecting Authority', timeline: 'At the time of, and following, each inspection', link: 'https://drive.google.com/file/d/1KYJPMx1jNSUTx4pH9yW-ayD6ZTHn_i23/view?usp=drive_link' },
  { id: 'cmr-16', form: 'FORM 7', title: "Manager's charge report", regulation: 'CMR', rule: 'CMR 2017, Regulation 28', recurrence: 'Event-based (on change of Manager)', mode: 'FORM 7 (physical statutory record)', signingAuthority: 'Incoming Manager and Outgoing Manager', submissionAuthority: 'Maintained as statutory mine record under Regulation 28', timeline: 'At the time of handing over/taking over charge of the mine', link: 'https://drive.google.com/file/d/1nVix1VUTPvDjhr0RIJcfl22PZtYpU0cs/view?usp=drive_link' },
];

const explosivesForms = [
  { id: 'er-1', form: 'FORM LE-3', title: 'Licence to possess for use, explosives of Class 1, 2, 3, 4, 5, 6 or 7 in a magazine', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 99, Schedule IV Part 1, Article 3(c)', recurrence: 'One-time grant, renewable annually (via RE-1)', mode: 'FORM LE-3 (licence certificate issued by licensing authority)', signingAuthority: 'Occupier / Licensee', submissionAuthority: 'Chief Controller or Controller of Explosives authorised by Chief Controller (PESO)', timeline: 'Prior to possession/use of explosives at the mine magazine; renewed annually before expiry', link: '' },
  { id: 'er-2', form: 'FORM AE-3', title: 'Application for approval or grant or amendment or transfer of licence for possession and use of explosives in a magazine', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 113', recurrence: 'Event-based (new licence, amendment, or transfer)', mode: 'FORM AE-3 (physical/postal submission to Controller of Explosives)', signingAuthority: 'Occupier / Applicant', submissionAuthority: 'Chief Controller or Controller of Explosives (PESO)', timeline: 'Before commencing possession/use, or before amendment/transfer of an existing licence', link: '' },
  { id: 'er-3', form: 'FORM LE-7', title: 'Licence to transport explosives in a road van', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 99, Schedule IV Part 1, Article 7', recurrence: 'One-time grant, renewable annually (via RE-1)', mode: 'FORM LE-7 (licence certificate issued by licensing authority)', signingAuthority: 'Occupier / Licensee', submissionAuthority: 'Controller of Explosives (PESO)', timeline: 'Prior to transporting explosives by road van; renewed annually before expiry', link: '' },
  { id: 'er-4', form: 'FORM AE-7', title: 'Application for approval or grant or amendment or transfer of licence for transport of explosives in road van', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 113', recurrence: 'Event-based (new licence, amendment, or transfer)', mode: 'FORM AE-7 (physical/postal submission to Controller of Explosives)', signingAuthority: 'Occupier / Applicant', submissionAuthority: 'Controller of Explosives (PESO)', timeline: 'Before commencing road van transport, or before amendment/transfer', link: 'https://drive.google.com/file/d/1N_uusT-mnkF1Mbkj6yUEPHKrXp4mILqs/view?usp=drivesdk' },
  { id: 'er-5', form: 'FORM AE-12', title: 'Application for grant of no objection certificate under the Explosives Rules, 2008', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 113 (format per Rules 102 & 103)', recurrence: 'Event-based (prior to licence application)', mode: 'FORM AE-12 (physical/postal submission)', signingAuthority: 'Occupier / Applicant', submissionAuthority: 'District Magistrate / Directorate General of Mines Safety (DGMS, for sites under the Mines Act)', timeline: 'Before applying for magazine, manufacture, or road van transport licence', link: 'https://drive.google.com/file/d/1TUMcAcMG21PqFzVVzDU8POOFFnwPRU37/view?usp=drivesdk' },
  { id: 'er-6', form: 'FORM LE-1', title: 'Licence to manufacture at site, ANFO explosives not exceeding 200 kilogrammes at any one time', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 99, Schedule IV Part 1, Article 1(d)', recurrence: 'One-time grant, renewable annually (via RE-1)', mode: 'FORM LE-1 (licence certificate issued by licensing authority)', signingAuthority: 'Occupier / Licensee', submissionAuthority: 'Controller of Explosives (PESO)', timeline: 'Prior to commencing on-site ANFO manufacture; renewed annually before expiry', link: 'https://drive.google.com/file/d/1HbR1hmsLAyKDsHJehLNPhLCddm9OFQWP/view?usp=drivesdk' },
  { id: 'er-7', form: 'FORM AE-1', title: 'Application for approval or grant or amendment or transfer of licence for manufacture of explosives', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 113', recurrence: 'Event-based (new licence, amendment, or transfer)', mode: 'FORM AE-1 (physical/postal submission to Controller of Explosives)', signingAuthority: 'Occupier / Applicant', submissionAuthority: 'Controller of Explosives (PESO)', timeline: 'Before commencing manufacture, or before amendment/transfer of an existing licence', link: 'https://drive.google.com/file/d/11tU2wVmtXSDqAGV-OFy5vJp2N9c9fkZY/view?usp=drivesdk' },
  { id: 'er-8', form: 'FORM RE-1', title: 'Application for renewal or revalidation of licence or certificate', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 112', recurrence: 'Annual (before expiry of each licence held — LE-1, LE-3, LE-7)', mode: 'FORM RE-1 (physical/postal submission to licensing authority)', signingAuthority: 'Occupier / Licensee', submissionAuthority: 'Chief Controller or Controller of Explosives, as applicable to the licence (PESO)', timeline: 'Before expiry of the licence/certificate being renewed', link: '' },
  { id: 'er-9', form: 'FORM RE-2', title: 'Form of account to be maintained by a licensee — accounts of explosives manufactured (other than fireworks)', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 24', recurrence: 'Continuous (record to be kept up-to-date)', mode: 'FORM RE-2 (register maintained at licensed premises)', signingAuthority: 'Occupier / Licensee / Authorised Signatory', submissionAuthority: 'Maintained at site for inspection by Controller of Explosives', timeline: 'Updated continuously as ANFO is manufactured', link: 'https://drive.google.com/file/d/1OFdEUVNQt7I9xH556IMENHHYPmrXcejG/view?usp=drivesdk' },
  { id: 'er-10', form: 'FORM RE-3', title: 'Form of account to be maintained by a licensee — accounts of receipt of explosives (other than fireworks)', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 24', recurrence: 'Continuous (record to be kept up-to-date)', mode: 'FORM RE-3 (register maintained at licensed premises)', signingAuthority: 'Occupier / Licensee / Authorised Signatory', submissionAuthority: 'Maintained at site for inspection by Controller of Explosives', timeline: 'Updated on each receipt of explosives into the magazine', link: 'https://drive.google.com/file/d/1lxBHOwcqCBuxO4RIfJ6kMoI4eoAaxPqE/view?usp=drivesdk' },
  { id: 'er-11', form: 'FORM RE-5', title: 'Form of account to be maintained by a licensee — accounts of explosives used by licensee (other than fireworks)', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 24', recurrence: 'Continuous (per blast/shift)', mode: 'FORM RE-5 (register maintained at licensed premises)', signingAuthority: 'Shot firer / Occupier / Licensee', submissionAuthority: 'Maintained at site for inspection by Controller of Explosives', timeline: 'Updated after every blasting operation', link: '' },
  { id: 'er-12', form: 'FORM RE-6', title: 'Form of records to be maintained by a licensee — records of explosives transported by road van', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 61(2)', recurrence: 'Event-based (each road van trip)', mode: 'FORM RE-6 (register maintained by road van licensee)', signingAuthority: 'Occupier / Licensee / Driver-in-charge', submissionAuthority: 'Maintained at site for inspection by Controller of Explosives', timeline: 'Updated for every transport of explosives by road van', link: 'https://drive.google.com/file/d/10TQLLzU4XxaQ4hGehPFhTn1hPv57w8Vt/view?usp=drivesdk' },
  { id: 'er-13', form: 'FORM RE-7', title: 'Return of explosives — received, used, sold, destroyed and stolen during the month, in respect of the explosives magazine or store house', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 24', recurrence: 'Monthly', mode: 'FORM RE-7 (physical/postal submission)', signingAuthority: 'Occupier / Licensee', submissionAuthority: 'Controller of Explosives (PESO)', timeline: 'Monthly, within the prescribed period after month-end', link: '' },
  { id: 'er-14', form: 'FORM RE-11', title: 'Form of indent for explosives', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rules 50 and 77', recurrence: 'Event-based (each purchase order)', mode: 'FORM RE-11 (indent to licensed supplier)', signingAuthority: 'Occupier / Licensee', submissionAuthority: 'Licensed supplier/manufacturer', timeline: 'Raised each time explosives are ordered for the mine', link: '' },
  { id: 'er-15', form: 'FORM RE-12', title: 'Pass issued by the consignor for transport of a consignment of explosives', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rules 47 and 50', recurrence: 'Event-based (each consignment)', mode: 'FORM RE-12 (accompanies consignment; copy forwarded to Controller of Explosives)', signingAuthority: 'Consignor (Supplier), countersigned on receipt by Consignee (Occupier)', submissionAuthority: 'Controller of Explosives (PESO) — copy forwarded', timeline: 'Issued with every consignment dispatched to the mine', link: 'https://drive.google.com/file/d/17wuWBNI9QDUrzvg6ZuzNZ3Ek7gu4eXHe/view?usp=drivesdk' },
  { id: 'er-16', form: 'FORM DE-1', title: 'Distance form to be submitted by the applicant indicating the clear distances available around proposed storage magazine for explosives or proposed explosives factory', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 113', recurrence: 'Event-based (submitted with licence application)', mode: 'FORM DE-1 (submitted alongside AE-1/AE-3 application)', signingAuthority: 'Occupier / Applicant', submissionAuthority: 'Controller of Explosives (PESO)', timeline: 'Submitted along with the licence application, before grant', link: '' },
  { id: 'er-17', form: 'FORM DE-2', title: 'Distance form attached to the licence — safety distances required to be kept clear around magazine for high explosives or factory', regulation: 'ER 2008', rule: 'Explosives Rules, 2008, Rule 113', recurrence: 'One-time (attached at grant); safety distances maintained through licence validity', mode: 'FORM DE-2 (annexure attached to LE-1/LE-3 licence)', signingAuthority: 'Controller of Explosives (issuing authority)', submissionAuthority: 'Controller of Explosives (PESO)', timeline: 'Issued at time of licence grant; distances to be maintained throughout validity', link: 'https://drive.google.com/file/d/1FtytptGs4MyoXNAT7hCd8JH3PfBlqXiE/view?usp=drivesdk' },
];

const cerForms = [
  { id: 'cer-1', form: 'FORM I', title: 'Inspection Report — electrical installations of voltage up to and including 250 V', regulation: 'CEA 2023', rule: 'CEA (Measures relating to Safety and Electric Supply) Regulations, 2023, Regulations 32 & 45, Schedule II', recurrence: 'Periodic (Electrical Safety Officer inspection at intervals not exceeding 1 year; statutory self-certification not exceeding 5 years)', mode: 'FORM I (inspection report / self-certification submitted to Electrical Inspector)', signingAuthority: 'Supplier / Owner / Consumer (self-certification) or Electrical Inspector', submissionAuthority: 'Electrical Inspector (State Electrical Inspectorate)', timeline: 'Before commencement of supply and on periodic inspection / self-certification', link: 'https://drive.google.com/file/d/16_hOByrwSe0Eb4E8cZEbiRGPaBwSoeTi/view?usp=drivesdk' },
  { id: 'cea-2', form: 'FORM II', title: 'Inspection Report — electrical installations of voltage more than 250 V up to and including 650 V', regulation: 'CEA 2023', rule: 'CEA (Measures relating to Safety and Electric Supply) Regulations, 2023, Regulations 32 & 45, Schedule II', recurrence: 'Periodic (Electrical Safety Officer inspection at intervals not exceeding 1 year; statutory self-certification not exceeding 5 years)', mode: 'FORM II (inspection report / self-certification submitted to Electrical Inspector)', signingAuthority: 'Supplier / Owner / Consumer (self-certification) or Electrical Inspector', submissionAuthority: 'Electrical Inspector (State Electrical Inspectorate)', timeline: 'Before commencement of supply and on periodic inspection / self-certification', link: 'https://drive.google.com/file/d/1KEbnAE-dTTVhHl_p_zUZxDVMGDbZkXCx/view?usp=drivesdk' },
  { id: 'cea-3', form: 'FORM III', title: 'Inspection Report — electrical installations of voltage exceeding 650 V (with self-certification certificate)', regulation: 'CEA 2023', rule: 'CEA (Measures relating to Safety and Electric Supply) Regulations, 2023, Regulations 32 & 45, Schedule II', recurrence: 'Periodic (Electrical Safety Officer inspection at intervals not exceeding 1 year; statutory inspection not exceeding 5 years)', mode: 'FORM III (inspection report; self-certification certificate countersigned by Chartered Electrical Safety Engineer, submitted to Electrical Inspector)', signingAuthority: 'Supplier / Owner / Consumer and Chartered Electrical Safety Engineer, or Electrical Inspector', submissionAuthority: 'Electrical Inspector (State Electrical Inspectorate)', timeline: 'Before commencement of supply and on periodic inspection', link: 'https://drive.google.com/file/d/1ivuer584hif1sbK1fMTpd2im_lJTvnEX/view?usp=drivesdk' },
  { id: 'cea-4', form: 'FORM IV', title: 'Inspection Report — electrical installations in a mine', regulation: 'CEA 2023', rule: 'CEA (Measures relating to Safety and Electric Supply) Regulations, 2023, sub-regulation (3) of Regulation 32, Schedule II', recurrence: 'Periodic (Electrical Safety Officer / Electrical Inspector of mines inspection at intervals not exceeding 1 year)', mode: 'FORM IV (inspection report prepared by Inspecting Officer; copy forwarded to Electrical Inspector of mines)', signingAuthority: 'Inspecting Officer (Electrical Inspector of mines)', submissionAuthority: 'Electrical Inspector of mines', timeline: 'On periodic inspection of the mine electrical installation', link: 'https://drive.google.com/file/d/1kGawyJY9Ykv5nXl0ZL_ywQ8d64gn6ZwY/view?usp=drivesdk' },
  { id: 'cea-5', form: 'SCHEDULE IX', title: 'Form of Annual Return for Mines', regulation: 'CEA 2023', rule: 'CEA (Measures relating to Safety and Electric Supply) Regulations, 2023, sub-regulation (1) of Regulation 98', recurrence: 'Annual', mode: 'SCHEDULE IX (annual return submitted to Electrical Inspector of mines)', signingAuthority: 'Owner / Agent / Manager / Engineer', submissionAuthority: 'Electrical Inspector of mines', timeline: 'On or before 1 February every year', link: 'https://drive.google.com/file/d/1qzXhU2xMkVTeNy_IYjZ5GRG0eEMIXDXt/view?usp=drivesdk' },
  { id: 'cea-6', form: 'SCHEDULE XI', title: 'Log Sheet for Mines and Oil-fields', regulation: 'CEA 2023', rule: 'CEA (Measures relating to Safety and Electric Supply) Regulations, 2023, sub-regulation (9) of Regulation 112 and sub-regulation (9) of Regulation 117', recurrence: 'Daily (continuous log)', mode: 'SCHEDULE XI (daily log sheet maintained at the mine)', signingAuthority: 'Electrical Supervisor; examined by Engineer and Manager', submissionAuthority: 'Maintained at the mine for inspection by Electrical Inspector of mines', timeline: 'Filled in daily by the Electrical Supervisor', link: 'https://drive.google.com/file/d/1jB1JjPp2wJo6iq82Tri7BzW-Hhjgb-Oa/view?usp=drivesdk' },
];

const FORM_REGULATIONS = [
  { key: 'OSH', label: 'OSH (Central) Rules 2026', shortLabel: 'OSH Rules Forms', data: oshForms },
  { key: 'CMR', label: 'Coal Mines Regulations, 2017', shortLabel: 'CMR Forms', data: cmrForms },
  { key: 'Explosives', label: 'Explosives Rules, 2008', shortLabel: 'Explosives Forms', data: explosivesForms },
  { key: 'CER', label: 'Central Electricity Rules', shortLabel: 'CER Forms', data: cerForms },
];

const FORM_STYLES = {
  OSH: { link: 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50', linkActive: 'bg-purple-600 text-white border-purple-600', header: 'bg-purple-600', badge: 'bg-purple-50 text-purple-600 border-purple-200', badgeHover: 'hover:bg-purple-100', btn: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100', detail: 'bg-purple-50' },
  CMR: { link: 'bg-white text-green-600 border-green-200 hover:bg-green-50', linkActive: 'bg-green-600 text-white border-green-600', header: 'bg-green-600', badge: 'bg-green-50 text-green-600 border-green-200', badgeHover: 'hover:bg-green-100', btn: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100', detail: 'bg-green-50' },
  Explosives: { link: 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50', linkActive: 'bg-orange-600 text-white border-orange-600', header: 'bg-orange-600', badge: 'bg-orange-50 text-orange-600 border-orange-200', badgeHover: 'hover:bg-orange-100', btn: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100', detail: 'bg-orange-50' },
  CER: { link: 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50', linkActive: 'bg-blue-600 text-white border-blue-600', header: 'bg-blue-600', badge: 'bg-blue-50 text-blue-600 border-blue-200', badgeHover: 'hover:bg-blue-100', btn: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100', detail: 'bg-blue-50' },
};

/* ---------------------------------------------------------------------------
   VIEW: Regulations
--------------------------------------------------------------------------- */
const RegulationsView = () => (
  <div>
    <div className="mb-3">
      <h2 className="ct-heading text-2xl font-normal text-gray-800 mb-1">Rules &amp; Regulations</h2>
      <p className="text-gray-500 text-sm">Official statutory documents governing mine operations</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
      {regulationDocs.map((doc) => {
        const c = regColorMap[doc.color];
        return (
          <a key={doc.title} href={doc.link.trim()} target="_blank" rel="noreferrer"
            className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
              <span className="text-gray-800 text-sm font-medium">{doc.title}</span>
            </div>
            <span className={`px-3 py-1.5 ${c.light} ${c.text} rounded-lg text-sm font-semibold whitespace-nowrap ml-4`}>
              Open PDF →
            </span>
          </a>
        );
      })}
    </div>
  </div>
);

/* ---------------------------------------------------------------------------
   VIEW: Codes of Practice
--------------------------------------------------------------------------- */
const COPView = () => {
  const [query, setQuery] = useState('');
  const enriched = useMemo(() => copDocs.map((doc) => ({ ...doc, code: getCode(doc.title) })), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return enriched;
    return enriched.filter((doc) => doc.title.toLowerCase().includes(q) || doc.code.includes(q));
  }, [query, enriched]);

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Standard operating procedures &middot; Gare Palma IV/2&amp;3
        </p>
        <p className="mt-1 text-sm text-slate-500">Codes of Practice (COP).</p>
      </div>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or COP number…"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </div>

      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-xs text-slate-400">
          Showing <span className="font-medium text-slate-600">{filtered.length}</span> of {copDocs.length} documents
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <FileX className="h-6 w-6 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No documents match "{query}"</p>
            <p className="text-xs text-slate-400">Try a different keyword or COP number.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((doc) => {
              const style = copCategoryStyles[doc.color] || copCategoryStyles.blue;
              return (
                <li key={doc.code + doc.title} className="group relative">
                  <a href={doc.link} target="_blank" rel="noreferrer"
                    className="flex items-center gap-4 py-3 pl-4 pr-5 transition-colors hover:bg-slate-50">
                    <span className={`h-6 w-1 shrink-0 rounded-full ${style.tab}`} aria-hidden="true" />
                    <span className={`shrink-0 rounded-md px-2 py-1 font-mono text-xs font-medium ring-1 ring-inset ${style.chip}`}>
                      COP&middot;{pad(doc.code)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{doc.title}</span>
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-400 transition-colors group-hover:text-slate-700">
                      Open PDF
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <p className="mt-4 px-1 text-xs text-slate-400">
        For controlled copies or amendments, contact the Safety Officer, Gare Palma IV/2&amp;3 Coal Mine.
      </p>
    </div>
  );
};

/* ---------------------------------------------------------------------------
   VIEW: Forms
--------------------------------------------------------------------------- */
const FormsView = () => {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [openSections, setOpenSections] = useState({ OSH: true });

  const toggleSection = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const matchesSearch = (f) =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.form.toLowerCase().includes(search.toLowerCase()) ||
    f.rule.toLowerCase().includes(search.toLowerCase()) ||
    f.id.toLowerCase().includes(search.toLowerCase());

  return (
    <div>
      <div className="mb-6">
        <h2 className="ct-heading text-2xl font-normal text-gray-800 mb-1">Forms</h2>
        <p className="text-gray-500 text-sm">
          The Mines Act, 1952 has been repealed and replaced by the OSH Code, 2020; consequently, CMR, 2017 forms have been superseded by the OSH Central Rules, 2026.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        {FORM_REGULATIONS.map((r) => {
          const s = FORM_STYLES[r.key];
          const isOpen = !!openSections[r.key];
          return (
            <button key={r.key} onClick={() => toggleSection(r.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${isOpen ? s.linkActive : s.link}`}>
              {r.shortLabel} ({r.data.length}) {isOpen ? '▲' : '▼'}
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search within an open regulation by title, form number or rule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {FORM_REGULATIONS.filter((r) => openSections[r.key]).map((r) => {
        const s = FORM_STYLES[r.key];
        const filtered = r.data.filter(matchesSearch);
        return (
          <div key={r.key} className="mb-8">
            <div className={`${s.header} text-white px-5 py-3 rounded-t-xl`}>
              <h3 className="font-medium text-sm">STATUTORY FORMS - {r.label.toUpperCase()} ({filtered.length} FORMS)</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 text-gray-500 font-medium w-10">#</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Form</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Title</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Rule</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Recurrence</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Timeline</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center text-gray-400 py-10">
                          {r.data.length === 0 ? `No forms added yet for ${r.label}.` : 'No forms found'}
                        </td>
                      </tr>
                    ) : filtered.map((f) => (
                      <React.Fragment key={`${r.key}-${f.id}`}>
                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-400 text-xs">{f.id}</td>
                          <td className="px-4 py-3">
                            {f.link ? (
                              <a href={f.link} target="_blank" rel="noopener noreferrer"
                                className={`px-2 py-1 ${s.badge} rounded text-xs font-bold whitespace-nowrap ${s.badgeHover} hover:underline inline-block`}>
                                {f.form}
                              </a>
                            ) : (
                              <span className={`px-2 py-1 ${s.badge} rounded text-xs font-bold whitespace-nowrap`}>{f.form}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-800 font-medium max-w-xs"><p className="leading-snug">{f.title}</p></td>
                          <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{f.rule}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs max-w-xs">{f.recurrence}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs max-w-xs">{f.timeline}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => setExpanded(expanded === `${r.key}-${f.id}` ? null : `${r.key}-${f.id}`)}
                              className={`px-3 py-1 ${s.btn} rounded text-xs transition`}>
                              {expanded === `${r.key}-${f.id}` ? 'Hide ▲' : 'View ▼'}
                            </button>
                          </td>
                        </tr>
                        {expanded === `${r.key}-${f.id}` && (
                          <tr className={s.detail}>
                            <td colSpan={7} className="px-6 py-4">
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <div><p className="text-xs font-medium text-gray-500 mb-1">Signing Authority</p><p className="text-sm text-gray-700">{f.signingAuthority}</p></div>
                                  <div><p className="text-xs font-medium text-gray-500 mb-1">Submission Authority</p><p className="text-sm text-gray-700">{f.submissionAuthority}</p></div>
                                  <div><p className="text-xs font-medium text-gray-500 mb-1">Mode of Submission</p><p className="text-sm text-gray-700">{f.mode}</p></div>
                                </div>
                                <div className="space-y-3" />
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-gray-400 text-xs">Showing {filtered.length} of {r.data.length} forms</p>
              </div>
            </div>
          </div>
        );
      })}

      {FORM_REGULATIONS.every((r) => !openSections[r.key]) && (
        <div className="text-center text-gray-400 py-16 bg-white rounded-xl border border-gray-200">
          Click a regulation above to view its forms
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------------------
   MAIN: StatutoryLibrary — one page, three tabs
--------------------------------------------------------------------------- */
const TABS = [
  { key: 'regulations', label: 'Regulations', count: regulationDocs.length, color: '#1E40AF' },
  { key: 'cop', label: 'Codes of Practice', count: copDocs.length, color: '#16A34A' },
  { key: 'forms', label: 'Forms', count: oshForms.length + cmrForms.length + explosivesForms.length + cerForms.length, color: '#F97316' },
];

const StatutoryLibrary = () => {
  const [tab, setTab] = useState('regulations');

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        .ct-heading { font-family: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <div className="px-8 pt-8 pb-4 border-b border-gray-200 bg-white">
        <h1 className="ct-heading text-2xl font-bold text-gray-900">Statutory Library</h1>
        <p className="text-gray-500 text-sm mt-1">
          Every applicable regulation, code of practice, and form — in one place.
        </p>

        <div className="flex gap-2 mt-5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-4 py-2 rounded-lg text-sm font-semibold border transition"
              style={tab === t.key
                ? { backgroundColor: t.color, borderColor: t.color, color: '#fff' }
                : { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#374151' }}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        {tab === 'regulations' && <RegulationsView />}
        {tab === 'cop' && <COPView />}
        {tab === 'forms' && <FormsView />}
      </div>
    </div>
  );
};

export default StatutoryLibrary;