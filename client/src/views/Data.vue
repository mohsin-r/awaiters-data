<template>
    <div id="data">
        <Sidebar active="data" />
        <div id="header"  v-if="studentsLoaded && subjectsLoaded">
            <h1>Data Entry Form</h1>
            <h2> Enter the data below. Please follow the correct formats.</h2>
        </div>
        <div id="body"  v-if="studentsLoaded && subjectsLoaded">
          <form @submit.prevent>
            <div id="metadata">
              <div id="date" class="field">
                <label> Date </label>
                <input type="text" v-model="data.date" placeholder="YYYY-MM-DD">
              </div>
              <div id="startTime" class="field">
                <label> Start Time </label>
                <input type="text" v-model="data.class.startTime" placeholder="HH:MMam/pm">
              </div>
              <div id="endTime" class="field">
                <label> End Time </label>
                <input type="text" v-model="data.class.endTime" placeholder="HH:MMam/pm">
              </div>
              <div id="teachers" class="field">
                <label> Teacher(s) (separate multiple names with commas) </label>
                <input type="text" v-model="data.class.teachers">
              </div>
            </div>
            <div id="coverage">
              <h2>Subject Data</h2>
              <table>
                <col style="width: 20%">
                <col style="width: 15%">
                <col style="width: 20%">
                <col style="width: 32%">
                <col style="width: 13%">
                <thead>
                  <tr>
                    <td>Subject Name</td>
                    <td>Chapter Number</td>
                    <td>Chapter Name</td>
                    <td>Notes/Particulars</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(subject, index) in data.class.coverage" :key="index">
                    <td><input type="text" v-model="subject.name" :placeholder="'Subject ' + (index + 1)"></td>
                    <td><input type="text" v-model="subject.chapterNum"></td>
                    <td><input type="text" v-model="subject.chapterName"></td>
                    <td><input type="text" v-model="subject.notes"></td>
                    <td><button @click.prevent="removeSubject(index)"><i class="fas fa-trash-can"></i>Remove</button></td>
                  </tr>
                  <tr>
                    <td><button @click.prevent="addSubject"><i class="fas fa-circle-plus"></i>Add Subject</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div id="students">
              <h2>Student Data</h2>
              <table>
                <col style="width: 22%">
                <col style="width: 13%">
                <col style="width: 13%">
                <col style="width: 9%">
                <col style="width: 15%">
                <col style="width: 15%">
                <col style="width: 13%">
                <thead>
                  <tr>
                    <td>Student Name</td>
                    <td>Attendance</td>
                    <td>Late (minutes)</td>
                    <td>Homework</td>
                    <td>Number of verses</td>
                    <td>Number of pages</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student, index) in data.student" :key="index">
                    <td><input type="text" v-model="student.name" placeholder="Student Name"></td>
                    <td style="padding-right: 0.8rem">
                      <select v-model="student.attendance">
                        <option>P</option>
                        <option>A</option>
                      </select>
                    </td>
                    <td><input type="number" v-model="student.late"></td>
                    <td><input type="checkbox" v-model="student.homework"></td>
                    <td><input type="number" v-model="student.verses" min="0"></td>
                    <td><input type="number" v-model="student.pages" min="0"></td>
                    <td><button @click.prevent="removeStudent(index)"><i class="fas fa-trash-can"></i>Remove</button></td>
                  </tr>
                  <tr>
                    <td><button @click.prevent="addStudent"><i class="fas fa-circle-plus"></i>Add Student</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div id="assessments">
              <h2>Assessment Data</h2>
              <div style="margin-bottom: 2rem" v-for="(assessment, index) in data.assessment" :key="index">
                <div class="assessmentHeader">
                  <h2 style="font-weight: normal; display: inline;">Assessment {{ index + 1}}</h2>
                  <button @click.prevent="removeAssessment(i)"><i class="fas fa-trash-can"></i>Remove Assessment</button>
                </div>
                <div class="assessmentMetadata">
                  <div class="field">
                    <label>Subject</label>
                    <input type="text" v-model="assessment.subject">
                  </div>
                  <div class="field">
                    <label>Chapter Number(s)</label>
                    <input type="text" v-model="assessment.chapterNum">
                  </div>
                  <div class="field">
                    <label>Chapter Name</label>
                    <input type="text" v-model="assessment.chapterName">
                  </div>
                </div>
                <table>
                  <col style="width: 46%">
                  <col style="width: 27%">
                  <col style="width: 27%">
                  <thead>
                    <tr>
                      <td>Student Name</td>
                      <td>Mark</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(student, i) in data.assessment[index].marks" :key="i">
                      <td><input type="text" v-model="student.name" placeholder="Student Name"></td>
                      <td><input type="number" min="0" max="100" v-model="student.mark"></td>
                      <td><button @click.prevent="removeStudentFromAssessment(index, i)"><i class="fas fa-trash-can"></i>Remove</button></td>
                    </tr>
                    <tr>
                      <td><button @click.prevent="addStudentToAssessment(index, i)"><i class="fas fa-circle-plus"></i>Add Student</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p v-if="data.assessment.length === 0">There are currently no assessments for this date.</p>
              <button @click="addAssessment" id="addAssessment"><i class="fas fa-circle-plus"></i>Add Assessment</button>
            </div>
            <div id="submit">
              <p>{{ message }}</p>
              <button @click="handleSubmit">{{ route.params.date === "new" ? "Submit Form" : "Save"}}</button>
              <button @click="router.push({name: 'Dashboard'})">Return Home</button>
            </div>
          </form>
          <br />
          <br />
          <br />
        </div>
    </div>
</template>

<script lang="ts">
import Sidebar from "../components/Sidebar.vue"
import env from '../apiConfig'
import { useStore } from "vuex"
import { ref, onBeforeMount, watch } from "vue"
import router, { useRouter, useRoute, onBeforeRouteLeave } from "vue-router"
export default {
  components: {Sidebar},
  props: [],
  setup(props: any) {
    const loaded = ref(false)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const host = env.api_host
    const message = ref('')
    const existingDate = ref('')
    const studentsLoaded = ref(false)
    const subjectsLoaded = ref(false)
    let studentList: any = []
    const data: any = ref({
      name: store.state.user,
      date: '',
      class: {
        teachers: '',
        startTime: '',
        endTime: '',
        coverage: []
      },
      student: [],
      assessment: []
    })

    const newSetup = () => {
      // get student list from the server
      fetch(`${host}/get_student_by_class/${store.state.user}`, {
        credentials: "include",
        mode: "cors"
      })
      .then(res => {
          if (res.status === 200) {
            return res.json()
          }
          throw new Error()
      })
      .then(json => {
          if (json) {
            studentList = json.result
            studentList.forEach((student: any) => {
              data.value.student.push({
                name: student.name,
                attendance: 'P',
                late: '',
                homework: false,
                verses: '',
                pages: ''
              })
            });
          }
          studentsLoaded.value = true
      })
      .catch(error => {
          studentsLoaded.value = true
          console.log(error)
      })

      // fetch defaults from the server
      fetch(`${host}/get_default/${store.state.user}`, {
        credentials: "include",
        mode: "cors"
      })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
        throw new Error()
      })
      .then(json => {
        if (json) {
          data.value.class.startTime = json.startTime
          data.value.class.endTime = json.endTime
          data.value.class.teachers = json.teachers
          json.subjects.forEach((subject: String) => {
            data.value.class.coverage.push({name: subject, chapterNum: '', chapterName: '', notes: ''})
          });
        }
        subjectsLoaded.value = true
      })
      .catch(error => {
        subjectsLoaded.value = true
        console.log(error)
      })
    }

    const existingSetup = () => {
      // fetch defaults from the server
      fetch(`${host}/get_record_by_both/${route.params.date}/${store.state.user}`, {
        credentials: "include",
        mode: "cors"
      })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
        throw new Error()
      })
      .then(json => {
        if (json) {
          data.value = json[0]
          existingDate.value = data.value.date
          data.value.date = data.value.date.split('T')[0]
          subjectsLoaded.value = true
          studentsLoaded.value = true
        }
        else {
          throw new Error()
        }
      })
      .catch(error => {
        console.log(error)
        router.push({name: 'NotFound'})
      })
    }

    let unwatch: any;

    onBeforeMount(() => {
      if (route.params.date === 'new') {
        newSetup()
      }
      else {
        existingSetup()
      }
      unwatch = watch(() => route.params.date, (date, prevDate) => {
        studentsLoaded.value = false
        subjectsLoaded.value = false
        if (date === 'new') {
          newSetup()
        }
        else {
          existingSetup()
        }
      })
    })

    onBeforeRouteLeave(() => {
      unwatch()
    })

    const removeSubject = (index: number) => {
      data.value.class.coverage.splice(index, 1)
    }

    const addSubject = () => {
      data.value.class.coverage.push({name: '', chapterNum: '', chapterName: '', notes: ''})
    }

    const removeStudent = (index: number) => {
      data.value.student.splice(index, 1)
    }

    const addStudent = () => {
      data.value.student.push({name: '', attendance: 'P', late: '', homework: false, verses: '', pages: ''})
    }

    const removeAssessment = (index: number) => {
      data.value.assessment.splice(index, 1)
    }

    const addAssessment = () => {
      const markConfig: any = []
      studentList.forEach((student: any) => {
        markConfig.push({name: student.name, mark: ''})
      })
      data.value.assessment.push({subject: '', chapterNum: '', chapterName: '', marks: markConfig})
    }

    const removeStudentFromAssessment = (i: number, j: number) => {
      data.value.assessment[i].marks.splice(j, 1)
    }

    const addStudentToAssessment = (i: number) => {
      data.value.assessment[i].marks.push({name: '', mark: ''})
    }

    const handleSubmit = () => {
      const date: any = new Date(data.value.date)
      if (date === "Invalid Date" || isNaN(date)) {
        message.value = "You have not entered a valid date. A valid date is needed to save the data."
      }
      else {
        console.log(`${host}/new_record_data`)
        const request = new Request(`${host}/new_record_data`, {
          method: "post",
          body: JSON.stringify({name: store.state.user, date: existingDate.value === '' ? data.value.date : existingDate.value, data: data.value}),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        fetch(request, {
          credentials: "include",
          mode: "cors"
        })
        .then(res => {
          if (res.status === 200) {
            return res.json()
          }
          throw new Error()
        })
        .then(json => {
          console.log(json)
          message.value = "Your data was uploaded successfully! Redirecting you back to the dashboard..."
          setTimeout(() => router.push({name: "Dashboard"}), 2000)
        })
        .catch(error => {
          console.log(error)
          message.value = "An error occurred. Please check that your data is in the correct format and try again."
        })
      }
    }

    return { data,
             route,
             router,
             removeSubject,
             addSubject,
             removeStudent,
             addStudent,
             removeAssessment,
             addAssessment,
             removeStudentFromAssessment,
             addStudentToAssessment,
             handleSubmit,
             message,
             studentsLoaded,
             subjectsLoaded
           }
  }
}
</script>

<style scoped>
  #data {
    background-color: white;
    height: 100vh;
    overflow-x: hidden;
  }

  #header {
    margin-left: 250px;
    padding: 2rem 1rem;
    text-align: center;
  }

  #header h1 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }

  h2 {
    margin-top: 0;
    font-size: 1.3rem;
  }

  #body {
    margin-left: 250px;
    padding-left: 5rem;
    align-items: center;
  }

  form #metadata, .assessmentMetadata {
    display: flex;
    flex-wrap: wrap;
  }

  form label {
    display: block;
    height: fit-content;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 1.1rem;
  }

  form .field {
    width: 100%;
    max-width: 200px;
    margin-right: 4rem;
    margin-bottom: 2rem;
  }

  form #teachers {
    max-width: 500px;
  }

  form input {
    width: 100%;
    border: 2px solid #AD974F;
    border-radius: 0.25rem;
    padding: 0.5rem;
    font-size: 1rem;
    resize: none;
  }

  form table thead tr td {
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 1.1rem;
  }

  form table tbody tr td {
    padding-right: 2rem;
    padding-bottom: 0.5rem;
  }

  form table {
    margin-left: -4px;
    max-width: min(90%, 1000px);
    margin-bottom: 2rem;
  }

  button {
    font-size: 1rem;
    background-color: #AD974F;
    width: 100%;
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    padding: calc(0.5rem + 2px) calc(0.5rem + 2px);
    box-sizing: content-box;
  }
  button svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.4rem;
  }

  button:hover {
    transform: perspective(1px) scale(1.05);
  }

  select {
    border: 2px solid #AD974F;
    width: 100%;
    font-size: 1rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    resize: none;
  }

  input[type="checkbox"] {
    -webkit-appearance: none;
    appearance: none;
    margin: auto;
    font: inherit;
    color: currentColor;
    width: 1rem;
    height: 1rem;
    border: 2px solid #AD974F;
    border-radius: 0.25rem;
    display: grid;
    place-content: center;
    transform: translateX(10px);
  }

  input[type="checkbox"]::before {
    content: "";
    width: 0.7rem;
    height: 0.7rem;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 0.9rem 0.9rem #AD974F;
    transform-origin: bottom left;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  input[type="checkbox"]:checked::before {
    transform: scale(1);
  }

  #assessments .assessmentHeader {
    margin-bottom: 2rem;
    max-width: min(90%, 1000px);
  }

  #assessments .assessmentHeader button, #addAssessment {
    max-width: min(18%, 200px);
  }
  #assessments .assessmentHeader button {
    margin-right: 1rem;
    float: right;
  }

  #assessments table {
    max-width: 480px;
  }

  #submit {
    margin-top: 2rem;
    width: calc(100vw - 250px - 5rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  #submit button {
    max-width: min(30%, 300px);
    margin-bottom: 0.8rem;
    border-radius: 500px;
    font-size: 1.2rem;
    font-weight: 500;
  }

  #submit p {
    margin-bottom: 0.8rem;
    font-weight: 500;
    font-size: 1.2rem;
  }
</style>
