<template>
   <div>
     <v-card>
       <v-card-title class="headline">Список клиентов</v-card-title>
       <v-data-table 
       :headers="headers" 
       :items="clients"
       item-key="id">
         <template v-slot:item.actions="{ item }">
           <v-btn color="blue" @click="editClient(item)">Редактировать</v-btn>
           <v-btn color="red" @click="deleteClient(item.id)">Удалить</v-btn>
         </template>
         
         <template #bottom></template> 
       </v-data-table>
     </v-card>
 
     <v-card>
       <v-card-title class="headline">{{ editFlag ? 'Редактирование клиента' : 'Добавление клиента' }}</v-card-title>
       <v-form @submit.prevent="submitForm">
         <v-container>
           <v-row>
             <v-col cols="6" sm="4">
               <v-text-field v-model="form.firstName" label="Имя" required></v-text-field>
             </v-col>
             <v-col cols="6" sm="4">
               <v-text-field v-model="form.lastName" label="Фамилия" required></v-text-field>
             </v-col>
             <v-col cols="6" sm="4">
               <v-text-field v-model="form.email" label="Email" required></v-text-field>
             </v-col>
             <v-col cols="6" sm="4">
               <v-text-field v-model="form.phone" label="Телефон" required></v-text-field>
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
       clients: [],
       form: {
         firstName: '',
         lastName: '',
         email: '',
         phone: ''
       },
       editFlag: false,
       id: 0
     };
   },
   computed: {
    headers() {
      return [
      { title: 'Имя', value: 'firstName' },
         { title: 'Фамилия', value: 'lastName' },
         { title: 'Email', value: 'email' },
         { title: 'Телефон', value: 'phone' },
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
         const response = await axios.get('/clients/clients');
         this.clients = response.data.data;
       } catch (error) {
         console.error(error);
       }
     },
     editClient(client) {
       this.editFlag = true;
       this.id = client.id;
       this.form = { ...client };
     },
     async deleteClient(clientId) {
       try {
         await axios.post(`/clients/delete/${clientId}`);
         this.fetchData(); // Обновляем список клиентов после удаления.
       } catch (error) {
         console.error(error);
       }
     },
     async submitForm() {
       try {
         if (this.form.firstName && this.form.lastName && this.form.email && this.form.phone) {
           // Проверяем, что все поля формы заполнены перед отправкой данных.
           if (this.editFlag) {
             await axios.post(`/clients/edit/${this.id}`, this.form);
             this.editFlag = false;
           } else {
             // Иначе это создание нового клиента.
             await axios.post('/clients/create', this.form);
           }
           this.fetchData(); // Обновляем список клиентов после добавления или редактирования.
           this.resetForm(); // Сбрасываем форму после успешной отправки.
         }
       } catch (error) {
         console.error(error);
       }
     },
     resetForm() {
       this.form = {
         firstName: '',
         lastName: '',
         email: '',
         phone: ''
       };
     }
   }
 };
 </script>
 
 <style>
   .headline {
      margin-bottom: 16px;
  }
   .v-card .v-btn {
      margin-right: 8px;
  }
 </style>