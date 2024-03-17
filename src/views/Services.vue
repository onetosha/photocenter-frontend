<template>
   <div>
     <v-card>
       <v-card-title class="headline">Список услуг</v-card-title>
       <v-data-table :headers="headers" :items="services" item-key="id">
         <template v-slot:item.actions="{ item }">
           <v-btn color="blue" @click="editService(item)">Редактировать</v-btn>
           <v-btn color="red" @click="deleteService(item.id)">Удалить</v-btn>
         </template>
         <template #bottom></template>
       </v-data-table>
     </v-card>
 
     <v-card>
       <v-card-title class="headline">{{ editFlag ? 'Редактирование услуги' : 'Добавление услуги' }}</v-card-title>
       <v-form @submit.prevent="submitForm">
         <v-container>
           <v-row>
             <v-col cols="6" sm="4">
               <v-text-field v-model="form.name" label="Название" required></v-text-field>
             </v-col>
             <v-col cols="6" sm="4">
               <v-text-field v-model="form.description" label="Описание" required></v-text-field>
             </v-col>
             <v-col cols="6" sm="4">
               <v-text-field v-model="form.price" label="Цена" required></v-text-field>
             </v-col>
           </v-row>
           <v-row>
             <v-col>
               <v-btn type="submit" color="primary">Сохранить</v-btn>
               <v-btn @click="resetForm" color="secondary">Сбросить</v-btn>
             </v-col>
           </v-row>
         </v-container>
       </v-form>
     </v-card>
   </div>
 </template>
 
 <script>
 import axios from 'axios';
 
 export default {
   data() {
     return {
       services: [],
       form: {
         name: '',
         description: '',
         price: ''
       },
       editFlag: false,
       id: 0
     };
   },
   computed: {
    headers() {
      return [
        { title: 'Название', value: 'name' },
        { title: 'Описание', value: 'description' },
        { title: 'Цена', value: 'price' },
        { title: 'Действия', value: 'actions', sortable: false }
      ]
    }
   },
   mounted() {
     this.fetchData();
   },
   methods: {
     async fetchData() {
       try {
         const response = await axios.get('/services/services');
         this.services = response.data.data;
       } catch (error) {
         console.error(error);
       }
     },
     editService(service) {
       this.editFlag = true;
       this.id = service.id;
       this.form = { ...service };
     },
     async deleteService(serviceId) {
       try {
         await axios.post(`/services/delete/${serviceId}`);
         this.fetchData(); // Обновляем список услуг после удаления.
       } catch (error) {
         console.error(error);
       }
     },
     async submitForm() {
       try {
         if (this.form.name && this.form.description && this.form.price) {
           // Проверяем, что все поля формы заполнены перед отправкой данных.
           if (this.editFlag) {
             await axios.post(`/services/edit/${this.id}`, this.form);
             this.editFlag = false;
           } else {
             // Иначе это создание новой услуги.
             await axios.post('/services/create', this.form);
           }
           this.fetchData(); // Обновляем список услуг после добавления или редактирования.
           this.resetForm(); // Сбрасываем форму после успешной отправки.
         }
       } catch (error) {
         console.error(error);
       }
     },
     resetForm() {
       this.form = {
         name: '',
         description: '',
         price: ''
       };
     }
   }
 };
 </script>
 
 <style>
 .headline {
   margin-bottom: 16px;
 }
 </style>