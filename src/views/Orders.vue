<template>
   <div>
     <v-card>
       <v-card-title class="headline">Список заказов</v-card-title>
       <v-data-table :headers="headers" :items="orders" item-key="id">
         <template v-slot:item.actions="{ item }">
           <v-btn color="blue" @click="editOrder(item)">Редактировать</v-btn>
           <v-btn color="red" @click="deleteOrder(item.id)">Удалить</v-btn>
         </template>
         <template #bottom></template>
       </v-data-table>
     </v-card>
 
     <v-card>
       <v-card-title class="headline">{{ editFlag ? 'Редактирование заказа' : 'Добавление заказа' }}</v-card-title>
       <v-form @submit.prevent="submitForm">
         <v-container>
           <v-row>
             <v-col cols="6" sm="4">
               <v-select v-model="form.clientId" :items="clients" :item-title="'firstName'" :item-value="'id'" label="Клиент" required></v-select>
             </v-col>
             <v-col cols="6" sm="4">
               <v-select v-model="form.serviceId" :items="services" :item-title="'name'" :item-value="'id'" label="Услуга" required></v-select>
             </v-col>
             <v-col cols="6" sm="4">
               <v-select v-model="form.status" :items="statusOptions" label="Статус" required></v-select>
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
       orders: [],
       clients: [],
       services: [],
       form: {
         clientId: '',
         serviceId: '',
         status: ''
       },
       editFlag: false,
       id: 0,
       statusOptions: ['Ожидает оплаты', 'Оплачен', 'В процессе', 'Завершен']
     };
   },
   computed: {
    headers() {
      return [
         { title: 'Клиент', value: 'client.firstName', sortable: true },
         { title: 'Услуга', value: 'service.name', sortable: true },
         { title: 'Стоимость', value: 'amount', sortable: true},
         { title: 'Статус', value: 'statusText', sortable: true },
         { title: 'Время создания', value: 'formattedDateTime', sortable: true },
         { title: 'Действия', value: 'actions', sortable: false }
       ]
    },
    formattedDateTime() {
      return (item) => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('ru-RU');
        const formattedTime = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        return `${formattedDate} ${formattedTime}`;
      };
    }
   },
   mounted() {
     this.fetchData();
     this.fetchClients();
     this.fetchServices();
   },
   methods: {
     async fetchData() {
       try {
        const response = await axios.get('/orders/orders');
        this.orders = response.data.data.map((order) => {
          const date = new Date(order.date);
          return {
            ...order,
            statusText: this.statusOptions[order.status],
            formattedDate: date.toLocaleDateString('ru-RU'),
            formattedDateTime: `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
            };
          });
       } catch (error) {
         console.error(error);
       }
     },
     async fetchClients() {
       try {
         const response = await axios.get('/clients/clients');
         this.clients = response.data.data;
       } catch (error) {
         console.error(error);
       }
     },
     async fetchServices() {
       try {
         const response = await axios.get('/services/services');
         this.services = response.data.data;
       } catch (error) {
         console.error(error);
       }
     },
     editOrder(order) {
       this.editFlag = true;
       this.id = order.id;
       this.form = { ...order };
       this.form.status=this.statusOptions[this.form.status];
     },
     async deleteOrder(orderId) {
       try {
         await axios.post(`/orders/delete/${orderId}`);
         this.fetchData(); // Обновляем список заказов после удаления.
       } catch (error) {
         console.error(error);
       }
     },
     async submitForm() {
       try {
         if (this.form.clientId && this.form.serviceId && this.form.status) {
           // Проверяем, что все поля формы заполнены перед отправкой данных.
           this.form.status = this.statusOptions.indexOf(this.form.status);
           if (this.editFlag) {
             await axios.post(`/orders/edit/${this.id}`, this.form);
             this.editFlag = false;
           } else {
             // Иначе это создание нового заказа.
             await axios.post('/orders/create', this.form);
           }
          this.fetchData(); // Обновляем список заказов после добавления или редактирования.
          this.resetForm(); // Сбрасываем форму после успешной отправки.
         }
       } catch (error) {
         console.error(error);
       }
     },
     resetForm() {
       this.form = {
         clientId: '',
         serviceId: '',
         status: ''
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